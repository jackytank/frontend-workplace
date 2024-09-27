package jp.co.kepco.mdky.smlib;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.ResourceBundle;
import java.util.function.Consumer;
import java.util.function.Supplier;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.sqs.SqsClient;

/**
 * Control Request Simulator
 */
public class ControlRequestSimulator implements RequestHandler<RequestParameter, Void> {

    /** ロガー */
    private Logger logger = LogManager.getLogger(ControlRequestSimulator.class);

    /** JSON操作オブジェクト */
    private Gson gson = null;

    /** S3クライアント */
    private S3Client s3 = null;

    /** SQSクライアント */
    private SqsClient sqs = null;

    /**
     * デフォルトコンストラクタ
     */
    public ControlRequestSimulator() {
        this(S3Client.builder().build(), SqsClient.builder().build());
    }

    /**
     * ローカルでの動作確認用コンストラクタ
     *
     * @param s3Client S3クライアント
     */
    public ControlRequestSimulator(S3Client s3Client) {
        gson = new GsonBuilder().serializeNulls()
                .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES).create();
        s3 = s3Client;
    }

    /**
     * Constructor to init S3 and SQS clients
     * 
     * @param s3Client S3 client of type {@link S3Client}
     * @param sqsClient SQS client of type {@link SqsClient}
     */
    public ControlRequestSimulator(S3Client s3Client, SqsClient sqsClient) {
        this(s3Client);
        sqs = sqsClient;
    }

    /**
     * ハンドラ処理。
     * <ol>
     * <li>パラメータチェック</li>
     * <li>シミュレータ設定ファイル読み取り
     * ※{@link jp.co.kepco.mdky.smlib.ControlRequestSimulator#readSetting}</li>
     * <li>シミュレーション実行
     * ※{@link jp.co.kepco.mdky.smlib.ControlRequestSimulator#execute}</li>
     * </ol>
     * 
     * @param parameter リクエスト パラメータ
     * @param context   Lambdaコンテキスト
     */
    @Override
    public Void handleRequest(RequestParameter parameter, Context context) {
        // 開始ログ
        logger.info("ControlRequestSimulator.handleRequest start.");
        try {
            // パラメータチェック
            if (parameter.bucket == null || parameter.bucket.length() == 0) {
                throw new IllegalArgumentException("s3.bucket is empty.");
            }
            if (parameter.key == null || parameter.key.length() == 0) {
                throw new IllegalArgumentException("s3.key is empty.");
            }
            logger.info(String.format("bucket:%s, key:%s", parameter.bucket, parameter.key));

            // シミュレータ設定ファイル読み取り
            SimulatorSettings settings = readSetting(parameter.bucket, parameter.key);
record ResponseMsg() {};
            List<ResponseMsg> result = SQSUtils.getAllMessagesBody(sqs, "test-queue-url", 10, gson, ResponseMsg.class);

            // シミュレーション実行
            try {
                Supplier<Boolean> condtion = new CounterCondition(600);
                execute(settings, condtion);
            } catch (InterruptedException ex) {
                throw new RuntimeException(ex);
            }
        } finally {
            // 終了ログ
            logger.info("ControlRequestSimulator.handleRequest exit.");
        }

        return null;
    }

    /**
     * シミュレータ設定に従ってシミュレーションを実行する。
     * <ol>
     * <li>下記条件のいずれかに一致すれば、5.へ。それ以外は2.～4.の処理を繰り返し実行する
     * <ul>
     * <li>シミュレータ設定で指定されたインプットファイルをすべて検知した。</li>
     * <li>繰り返し回数が10回に到達した（仮）</li>
     * </ul>
     * </li>
     * <li>シミュレータ設定に定義されているインプットファイルをS3上で検索する
     * ※{@link jp.co.kepco.mdky.smlib.ControlRequestSimulator#triggerEvent}</li>
     * <li>インプットファイを見つけた場合、出力設定に従ってファイル出力する処理を別スレッドで開始する
     * ※{@link jp.co.kepco.mdky.smlib.ControlRequestSimulator#createOutputThread}</li>
     * <li>100ミリ秒スレッドを停止</li>
     * <li>上記1.のループを抜けた後、3.で作成したスレッドがすべて終了するまで待つ</li>
     * </ol>
     * 
     * @param simulatorSettings シミュレータ設定
     * @param condtion          シミレーション継続条件判定処理
     * @throws InterruptedException スレッドの開始に失敗する場合
     */
    private void execute(SimulatorSettings simulatorSettings, Supplier<Boolean> condtion) throws InterruptedException {
        List<Thread> threads = new ArrayList<>();
        boolean exitFlag = false;
        while (!exitFlag && condtion.get()) {
            exitFlag = true;
            for (SimulatorSettings.Setting setting : simulatorSettings.settings) {
                triggerEvent(setting, (fileSetting) -> {
                    // 別スレッドでファイル出力
                    Thread t1 = null;
                    if (fileSetting.output1 != null) {
                        t1 = createOutputThread(fileSetting.output1);
                        threads.add(t1);
                    }
                    Thread t2 = null;
                    if (fileSetting.output2 != null) {
                        t2 = createOutputThread(fileSetting.output2);
                        threads.add(t2);
                    }
                    if (t1 != null) {
                        t1.start();
                    }
                    if (t2 != null) {
                        t2.start();
                    }
                });

                // 監視するべきファイルがまだ残っているなら継続
                if (setting.files.size() > 0) {
                    exitFlag = false;
                }
            }

            // 次のループまで少しだけ待機
            Thread.sleep(100);
        }

        // 実行中のすべてのスレッドの終了を待つ
        for (Thread t : threads) {
            t.join();
        }
    }

    /**
     * シミュレータ設定に指定されているインプットファイルをS3に探して、見つけたら指定されたアクションを実行する。
     * 
     * @param setting シミュレータ設定
     * @param action  アクション
     */
    private void triggerEvent(SimulatorSettings.Setting setting, Consumer<SimulatorSettings.FileSetting> action) {
        // バケット内のファイルを抽出
        ListObjectsResponse res = s3.listObjects(ListObjectsRequest.builder().bucket(setting.bucket).build());
        // 抽出したファイルの中にインプットとして指定されているファイルを探す
        for (S3Object obj : res.contents()) {
            String key = obj.key();
            List<SimulatorSettings.FileSetting> newFiles = new ArrayList<>();
            for (SimulatorSettings.FileSetting fileSetting : setting.files) {
                if (key.equals(fileSetting.input)) {
                    // インプットファイルが見つかったらアクションを実行
                    action.accept(fileSetting);
                } else {
                    // インプットファイルが見つからなければ継続して探せるようにリストに入れておく
                    newFiles.add(fileSetting);
                }
            }
            // 見つかったインプットファイルを除いたリストをシミュレータ設定に入れなおしておく
            setting.files = newFiles;
        }
    }

    /**
     * ファイル出力処理を実行するスレッドを生成する。
     * 
     * @param outputSettings ファイル出力設定
     * @return 生成したスレッド
     */
    private Thread createOutputThread(SimulatorSettings.OutputSettings outputSettings) {
        Thread thread = new Thread(() -> {
            try {
                // 遅延時間の分待機
                if (outputSettings.delay > 0) {
                    Thread.sleep(outputSettings.delay);
                }
                // 出力のテンプレートファイル読み取り
                ResponseBytes<GetObjectResponse> res = s3.getObjectAsBytes(GetObjectRequest.builder()
                        .bucket(outputSettings.templateBucket)
                        .key(outputSettings.templateKey)
                        .build());

                // NOTE:テンプレートからの書き換え処理が必要ならここで実施

                // ファイル出力
                s3.putObject(PutObjectRequest.builder()
                        .bucket(outputSettings.bucket)
                        .key(outputSettings.key)
                        .build(), RequestBody.fromBytes(res.asByteArray()));
            } catch (InterruptedException e) {
                logger.fatal("exception occured at 'createOutputThread'.", e);
                throw new RuntimeException(e);
            }
        });
        return thread;
    }

    /**
     * JSON形式のシミュレータ設定ファイルを読み取って、シミュレータ設定オブジェクトを生成する。
     * 
     * @param bucket    S3バケット
     * @param objectKey S3キー
     * @return シミュレータ設定オブジェクト
     */
    private SimulatorSettings readSetting(String bucket, String objectKey) {
        ResponseBytes<GetObjectResponse> res = s3.getObjectAsBytes(GetObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .build());
        String json = res.asUtf8String();
        logger.info(String.format("read settings json file: %s", json));
        return gson.fromJson(json, SimulatorSettings.class);
    }

    /**
     * シミュレーションの継続条件をループカウンターで定義するクラス
     */
    private static class CounterCondition implements Supplier<Boolean> {

        /** ループ回数デフォルト上限値 */
        private static final int DEFAULT_LIMIT = 10;

        /** ループ回数上限値 */
        private final int limit;

        /** ループカウンタ */
        private int counter = 0;

        /**
         * デフォルト上限値での継続条件を生成する
         */
        public CounterCondition() {
            this(DEFAULT_LIMIT);
        }

        /**
         * 指定された上限値での継続条件を生成する
         * 
         * @param limitCount ループ回数の上限値
         */
        public CounterCondition(int limitCount) {
            this.limit = limitCount;
        }

        /**
         * 条件判定結果を取得する
         */
        @Override
        public Boolean get() {
            return counter++ < limit;
        }
    }

    /**
     * シミュレーションの継続条件を時間で定義するクラス
     */
    private static class TimerCondition implements Supplier<Boolean> {
        /** 継続時間（分）デフォルト上限値 */
        private static final int DEFAULT_MINUTES = 5;

        /** 継続時間（分）上限値 */
        private final int limitMinutes;

        /** 終了予定時刻 */
        private Calendar limitCalendar;

        /**
         * デフォルトの条件による継続条件を生成する
         */
        public TimerCondition() {
            this(DEFAULT_MINUTES);
        }

        /**
         * 指定された継続時間（分）による継続条件を生成する
         * 
         * @param limitMinutes シミュレーション継続時間（分）
         */
        public TimerCondition(int limitMinutes) {
            this.limitMinutes = limitMinutes;
        }

        /**
         * 条件判定結果を取得する
         */
        @Override
        public Boolean get() {
            Calendar now = Calendar.getInstance();
            if (limitCalendar == null) {
                limitCalendar = Calendar.getInstance();
                limitCalendar.add(Calendar.MINUTE, limitMinutes);
            }
            return now.before(limitCalendar);
        }

    }
}
