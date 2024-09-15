package com.learnaws;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.Message;
import com.amazonaws.services.sqs.model.ReceiveMessageRequest;

public class LambdaHandler implements RequestHandler<Request, Response> {

  private final AmazonS3 s3 = AmazonS3ClientBuilder.defaultClient();
  private final AmazonSQS sqs = AmazonSQSClientBuilder.defaultClient();
  private final String queueUrl = "https://sqs.us-east-1.amazonaws.com/033237493133/tri-aws-queue";
  private final String bucketName = "tri-aws-bucket";

  @Override
  public Response handleRequest(Request input, Context context) {
    LambdaLogger logger = context.getLogger();
    logger.log("Received request: " + input);
    ReceiveMessageRequest receiveMessageRequest = new ReceiveMessageRequest(queueUrl);
    List<Message> messages = sqs.receiveMessage(receiveMessageRequest).getMessages();

    for (Message message : messages) {
      String messageBody = message.getBody();
      String fileName = "message-" + message.getMessageId() + "_" + System.currentTimeMillis() + ".txt";
      InputStream inputStream = new ByteArrayInputStream(messageBody.getBytes(StandardCharsets.UTF_8));
      s3.putObject(bucketName, fileName, inputStream, null);
      sqs.deleteMessage(queueUrl, message.getReceiptHandle());
    }
    return new Response("Success");
    
  }
}
