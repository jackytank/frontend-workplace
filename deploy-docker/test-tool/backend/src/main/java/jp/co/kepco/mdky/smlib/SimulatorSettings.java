package jp.co.kepco.mdky.smlib;

import java.util.List;

/**
 * シミュレータ設定
 */
public class SimulatorSettings {

    /** シミュレーション設定リスト */
    public List<Setting> settings;

    /**
     * シミュレーション設定
     */
    public static class Setting {
        /**
         * 監視対象S3バケット
         */
        public String bucket;

        /** ファイル設定 */
        public List<FileSetting> files;
    }

    /**
     * ファイル設定
     */
    public static class FileSetting {
        /** 監視対象ファイルキー */
        public String input;
        /** ファイル出力設定1 */
        public OutputSettings output1;
        /** ファイル出力設定2 */
        public OutputSettings output2;
    }

    /**
     * ファイル出力設定
     */
    public static class OutputSettings {
        /** テンプレートファイル格納先S3バケット */
        public String templateBucket;
        /** テンプレートファイル格納先S3キー */
        public String templateKey;
        /** ファイル出力先S3バケット */
        public String bucket;
        /** ファイル出力先S3キー */
        public String key;
        /** ファイル出力実行遅延時間(ミリ秒) */
        public Integer delay = 0;
    }
}
