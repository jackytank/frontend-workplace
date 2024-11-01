package com.learnaws;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageResponse;
import software.amazon.awssdk.services.sqs.model.SendMessageRequest;
import software.amazon.awssdk.services.sqs.model.SendMessageResponse;

public class LambdaHandlerTest {

    @Mock
    private S3Client s3Client;
    @Mock
    private SqsClient sqsClient;
    @Mock
    private Context context;
    private LambdaHandler lambdaHandler;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        LambdaLogger logger = mock(LambdaLogger.class);
        when(context.getLogger()).thenReturn(logger);

        // Instantiate LambdaHandler with mocked clients
        lambdaHandler = new LambdaHandler() {
            @Override
            protected S3Client createS3Client() {
                return s3Client;
            }

            @Override
            protected SqsClient createSqsClient() {
                return sqsClient;
            }
        };
    }

    @Test
    public void testHandleRequestSuccess() {
        // Mock SQS message reception and response
        Message mockMessage = Message.builder().body("1").receiptHandle("handle").build();
        ReceiveMessageResponse receiveMessageResponse =
                ReceiveMessageResponse.builder().messages(List.of(mockMessage)).build();
        when(sqsClient.receiveMessage(any(ReceiveMessageRequest.class)))
                .thenReturn(receiveMessageResponse);

        // Mock SQS send message
        SendMessageResponse sendMessageResponse = SendMessageResponse.builder().build();
        when(sqsClient.sendMessage(any(SendMessageRequest.class))).thenReturn(sendMessageResponse);

        // Mock S3 file upload
        PutObjectResponse putObjectResponse = PutObjectResponse.builder().build();
        when(s3Client.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
                .thenReturn(putObjectResponse);

        // Prepare request input and invoke LambdaHandler
        Request request = new Request("Test message");
        Response response = lambdaHandler.handleRequest(request, context);

        // Assertions
        assertEquals("Success", response.responseMsg());
        assertEquals(true, response.isSuccess());
    }
}
