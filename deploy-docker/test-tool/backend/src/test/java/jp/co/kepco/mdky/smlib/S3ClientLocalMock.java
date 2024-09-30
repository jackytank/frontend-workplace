package jp.co.kepco.mdky.smlib;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import software.amazon.awssdk.awscore.exception.AwsServiceException;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.CopyObjectResponse;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.InvalidObjectStateException;
import software.amazon.awssdk.services.s3.model.ListObjectsRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsResponse;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.ObjectNotInActiveTierErrorException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.S3Object;

/**
 * ローカルのファイルシステムをS3と見立てて動作するS3クライアントモック
 */
public class S3ClientLocalMock implements S3Client {

    @Override
    public String serviceName() {
        throw new UnsupportedOperationException("Unimplemented method 'serviceName'");
    }

    @Override
    public void close() {
        throw new UnsupportedOperationException("Unimplemented method 'close'");
    }

    @Override
    public ResponseBytes<GetObjectResponse> getObjectAsBytes(GetObjectRequest getObjectRequest)
            throws NoSuchKeyException, InvalidObjectStateException, AwsServiceException, SdkClientException,
            S3Exception {

        Path p = Path.of(getObjectRequest.bucket(), getObjectRequest.key());
        try (InputStream is = Files.newInputStream(p)) {
            ResponseBytes<GetObjectResponse> res = ResponseBytes
                    .fromInputStream(GetObjectResponse.builder().build(), is);
            is.close();
            return res;
        } catch (UncheckedIOException | IOException e) {
            e.printStackTrace();
            throw S3Exception.create(e.getMessage(), e);
        }
    }

    @Override
    public CopyObjectResponse copyObject(CopyObjectRequest copyObjectRequest)
            throws ObjectNotInActiveTierErrorException, AwsServiceException, SdkClientException, S3Exception {
        Path sourcePath = Path.of(copyObjectRequest.sourceBucket(), copyObjectRequest.sourceKey());
        Path destinationPath = Path.of(copyObjectRequest.destinationBucket(), copyObjectRequest.destinationKey());
        try {
            // ファイルをいったん読込
            byte[] data = Files.readAllBytes(sourcePath);
            File f = new File(destinationPath.toUri());
            if (!f.getParentFile().exists()) {
                Files.createDirectories(f.getParentFile().toPath());
            }
            // ファイルを出力
            Files.write(destinationPath, data);
        } catch (IOException e) {
            e.printStackTrace();
            throw S3Exception.create(e.getMessage(), e);
        }
        return CopyObjectResponse.builder().build();
    }

    @Override
    public ListObjectsResponse listObjects(ListObjectsRequest listObjectsRequest)
            throws NoSuchBucketException, AwsServiceException, SdkClientException, S3Exception {
        List<String> foundFiles = listFiles(listObjectsRequest.bucket(), listObjectsRequest.bucket());
        return ListObjectsResponse.builder()
                .contents(
                        Arrays
                                .stream(foundFiles.toArray(new String[0]))
                                .map(value -> S3Object.builder().key(value).build())
                                .toList())
                .build();
    }

    private List<String> listFiles(String directory, String rootDirectory) {
        String prefix = directory.substring(rootDirectory.length());
        if (!prefix.isEmpty()) {
            // 先頭の「\」は取り除いておく（S3のプレフィックスのように）
            prefix = prefix.substring(1);
        }
        File rootDir = new File(directory);
        List<String> foundFiles = new ArrayList<>();
        for (File f : rootDir.listFiles()) {
            if (f.isDirectory()) {
                // 再起呼び出し
                foundFiles.addAll(listFiles(f.getAbsolutePath(), rootDirectory));
            } else {
                foundFiles.add(Path.of(prefix, f.getName()).toString());
            }
        }
        return foundFiles;
    }

    @Override
    public PutObjectResponse putObject(PutObjectRequest putObjectRequest, RequestBody requestBody)
            throws AwsServiceException, SdkClientException, S3Exception {
        Path destinationPath = Path.of(putObjectRequest.bucket(), putObjectRequest.key());
        // ファイルを出力
        try {
            Files.write(destinationPath, requestBody.contentStreamProvider().newStream().readAllBytes());
        } catch (IOException e) {
            e.printStackTrace();
            throw S3Exception.create(e.getMessage(), e);
        }
        return PutObjectResponse.builder().build();
    }
}
