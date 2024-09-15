package com.learnaws;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

public class LambdaHandler implements RequestHandler<Request, Response> {

    private final String queueUrl =
        "https://sqs.us-east-1.amazonaws.com/033237493133/tri-aws-queue";
    private final String bucketName = "tri-aws-bucket";

    @Override
    public Response handleRequest(Request input, Context context) {
        try (S3Client s3Client = S3Client.builder().region(Region.US_EAST_1)
            .credentialsProvider(EnvironmentVariableCredentialsProvider.create()).build()) {
            LambdaLogger logger = context.getLogger();
            logger.log("Received request: " + input);
            String fileName = input.requestMessage() + "_" + Instant.now().toString() + ".txt";
            PutObjectRequest request =
                PutObjectRequest.builder().bucket(bucketName).key(fileName).build();
            s3Client.putObject(request,
                RequestBody.fromString(input.requestMessage() + "_response"));
            return new Response("Success" + input.requestMessage());
        }
    }
}
