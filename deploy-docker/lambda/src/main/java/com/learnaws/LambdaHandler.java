package com.learnaws;

import java.time.Instant;
import java.util.Optional;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import software.amazon.awssdk.auth.credentials.EnvironmentVariableCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.DeleteMessageRequest;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageResponse;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;

public class LambdaHandler implements RequestHandler<Request, Response> {

    private final String queueUrl = System.getenv("QUEUE_URL");
    private final String bucketName = System.getenv("BUCKET_NAME");
    private final S3Client s3Client;
    private final SqsClient sqsClient;

    public LambdaHandler() {
        this.s3Client = createS3Client();
        this.sqsClient = createSqsClient();
    }

    @Override
    public Response handleRequest(Request input, Context context) {
        LambdaLogger logger = context.getLogger();
        logger.log(">> Received request: " + input);

        try {
            int number = receiveAndProcessMessageFromSQS();
            sendMessageToSQS(number);
            logger.log(">> Sent message to SQS: " + number);
            logMessagesFromSQS(logger);
            var fileContent = "hello file content: " + input.requestMessage();
            uploadTextFileToS3(number, fileContent);
            logger.log(
                    ">> Uploaded file to S3, fileContent: " + fileContent + " number: " + number);
            return new Response("Success", Instant.now().toString(), true);
        } catch (Exception e) {
            logger.log(">> Error processing message: " + e.getMessage());
            return new Response("Error", Instant.now().toString(), false);
        }
    }


    protected S3Client createS3Client() {
        return S3Client.builder().region(Region.US_EAST_1)
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create()).build();
    }

    protected SqsClient createSqsClient() {
        return SqsClient.builder().region(Region.US_EAST_1)
                .credentialsProvider(EnvironmentVariableCredentialsProvider.create()).build();
    }


    protected void logMessagesFromSQS(LambdaLogger logger) {
        ReceiveMessageRequest receiveMessageRequest =
                ReceiveMessageRequest.builder().queueUrl(queueUrl).maxNumberOfMessages(10).build();
        sqsClient.receiveMessage(receiveMessageRequest).messages()
                .forEach(message -> logger.log(">> Retrieved message from SQS: " + message.body()));
    }

    protected int receiveAndProcessMessageFromSQS() {
        ReceiveMessageRequest receiveMessageRequest =
                ReceiveMessageRequest.builder().queueUrl(queueUrl).maxNumberOfMessages(1).build();
        ReceiveMessageResponse receiveMessageResponse =
                sqsClient.receiveMessage(receiveMessageRequest);

        Optional<Message> messageOpt = receiveMessageResponse.messages().stream().findFirst();
        int number = messageOpt.map(message -> {
            int num = Integer.parseInt(message.body());
            deleteMessage(message);
            return num;
        }).orElse(0);

        return number + 1;
    }

    protected void sendMessageToSQS(int numberCounter) {
        SendMessageRequest sendMessageRequest = SendMessageRequest.builder().queueUrl(queueUrl)
                .messageBody(String.valueOf(numberCounter)).build();
        sqsClient.sendMessage(sendMessageRequest);
    }

    protected void uploadTextFileToS3(int number, String content) {
        String fileName =
                "incremented_number_" + number + "_" + "time_" + Instant.now().toString() + ".txt";
        PutObjectRequest putObjectRequest =
                PutObjectRequest.builder().bucket(bucketName).key(fileName).build();
        s3Client.putObject(putObjectRequest, RequestBody.fromString(content));

    }

    protected void deleteMessage(Message message) {
        DeleteMessageRequest deleteMessageRequest = DeleteMessageRequest.builder()
                .queueUrl(queueUrl).receiptHandle(message.receiptHandle()).build();
        sqsClient.deleteMessage(deleteMessageRequest);
    }
}
