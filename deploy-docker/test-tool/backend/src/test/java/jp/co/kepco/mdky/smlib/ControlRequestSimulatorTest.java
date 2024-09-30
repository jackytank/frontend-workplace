package jp.co.kepco.mdky.smlib;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.ListObjectsRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;

@ExtendWith(MockitoExtension.class)
public class ControlRequestSimulatorTest {

        /**
         * S3クライアントモック
         */
        @Mock
        private S3Client s3ClientMock;

        private Gson gson = new GsonBuilder()
                        .serializeNulls()
                        .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
                        .create();

        @Test
        public void handleRequestTest() {
                // 準備
                String bucket = "C:\\Users\\11479151\\Downloads\\smlib-sqs-utility-test\\control-instruction-simulator\\src\\test\\resources";
                String key = "testcase.json";
                // パラメータ
                RequestParameter parameter = new RequestParameter();
                parameter.bucket = bucket;
                parameter.key = key;

                S3Client s3Client = mock(S3Client.class);
                S3ClientBuilder builderMock = mock(S3ClientBuilder.class);
                when(builderMock.build()).thenReturn(s3Client);

                try (MockedStatic<S3Client> s3ClientStaticMock = Mockito.mockStatic(S3Client.class)) {
                        Mockito.when(S3Client.builder()).thenReturn(builderMock);
                        ControlRequestSimulator simulator = new ControlRequestSimulator();
                        simulator.handleRequest(parameter, null);
                }
        }

        @Test
        public void handleRequestTest2() {
                // 準備
                // シミュレータ設定を作成
                SimulatorSettings simulatorSettings = new SimulatorSettings();
                simulatorSettings.settings = new ArrayList<>();
                simulatorSettings.settings.add(new SimulatorSettings.Setting());
                simulatorSettings.settings.get(0).bucket = "bucket1";
                simulatorSettings.settings.get(0).files = new ArrayList<>();
                simulatorSettings.settings.get(0).files.add(new SimulatorSettings.FileSetting());
                simulatorSettings.settings.get(0).files.get(0).input = "input2.dat";
                simulatorSettings.settings.get(0).files.get(0).output1 = new SimulatorSettings.OutputSettings();
                simulatorSettings.settings.get(0).files.get(0).output1.templateBucket = "template_bucket1";
                simulatorSettings.settings.get(0).files.get(0).output1.templateKey = "template1.dat";
                simulatorSettings.settings.get(0).files.get(0).output1.bucket = "output_bucket1";
                simulatorSettings.settings.get(0).files.get(0).output1.templateKey = "output1.dat";
                simulatorSettings.settings.get(0).files.get(0).output2 = new SimulatorSettings.OutputSettings();
                simulatorSettings.settings.get(0).files.get(0).output2.templateBucket = "template_bucket2";
                simulatorSettings.settings.get(0).files.get(0).output2.templateKey = "template2.dat";
                simulatorSettings.settings.get(0).files.get(0).output2.bucket = "output_bucket2";
                simulatorSettings.settings.get(0).files.get(0).output2.templateKey = "output2.dat";
                // S3Mock
                // モック1:シミュレータ設定取得をモック
                GetObjectRequest req1 = GetObjectRequest.builder().bucket("bucket").key("key").build();
                ResponseBytes<GetObjectResponse> res1 = ResponseBytes.fromByteArray(GetObjectResponse.builder().build(),
                                gson.toJson(simulatorSettings).getBytes());
                when(s3ClientMock.getObjectAsBytes(req1)).thenReturn(res1);
                // モック2：バケット監視（リスト取得をモック）
                when(s3ClientMock.listObjects(ListObjectsRequest.builder().bucket("bucket1").build()))
                                .thenReturn(ListObjectsResponse.builder().build())
                                .thenReturn(
                                                ListObjectsResponse.builder()
                                                                .contents(S3Object.builder().key("input1.dat").build())
                                                                .build());
                // モック3:output1の処理をモック
                byte[] template1Data = new byte[] {
                                1, 0, 0, 0 };
                when(s3ClientMock
                                .getObjectAsBytes(GetObjectRequest.builder().bucket("template_bucket1")
                                                .key("template1.dat").build()))
                                .thenReturn(ResponseBytes.fromByteArray(GetObjectResponse.builder().build(),
                                                template1Data));
                when(s3ClientMock.putObject(
                                PutObjectRequest.builder().bucket("output_bucket1").key("output1.dat").build(),
                                RequestBody.fromBytes(template1Data))).thenReturn(null);
                byte[] template2Data = new byte[] {
                                2, 0, 0, 0 };
                when(s3ClientMock
                                .getObjectAsBytes(GetObjectRequest.builder().bucket("template_bucket2")
                                                .key("template3.dat").build()))
                                .thenReturn(ResponseBytes.fromByteArray(GetObjectResponse.builder().build(),
                                                template2Data));
                when(s3ClientMock.putObject(
                                PutObjectRequest.builder().bucket("output_bucket2").key("output2.dat").build(),
                                RequestBody.fromBytes(template2Data))).thenReturn(null);
                // パラメータ
                RequestParameter parameter = new RequestParameter();
                parameter.bucket = "bucket";
                parameter.key = "key";

                ControlRequestSimulator simulator = new ControlRequestSimulator(s3ClientMock);
                simulator.handleRequest(parameter, null);
        }
}
