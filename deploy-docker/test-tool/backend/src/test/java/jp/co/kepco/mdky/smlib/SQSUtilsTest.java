package jp.co.kepco.mdky.smlib;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.google.gson.Gson;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageResponse;

import java.util.*;
import java.util.function.Consumer;

@ExtendWith(MockitoExtension.class)
class SQSUtilsTest {
    @Test
    void testGetAllMessagesWhenSuccessThenReturnMessages() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final String queueUrl = "test-queue-url";
        final int maxNumberOfMessages = 10;

        final Message msg = Message.builder().body("test-msg-body").build();
        final ReceiveMessageResponse resp = ReceiveMessageResponse.builder().messages(msg).build();
        when(sqsClient.receiveMessage(any(ReceiveMessageRequest.class))).thenReturn(resp);

        final List<Message> msgs = SQSUtils.getAllMessages(sqsClient, queueUrl, maxNumberOfMessages);
        assertEquals(1, msgs.size());
        assertEquals("test-msg-body", msgs.get(0).body());
    }

    @Test
    void testGetAllMessagesWhenExceptionThenReturnEmptyList() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final String queueUrl = "test-queue-url";
        final int maxNumberOfMessages = 10;

        when(sqsClient.receiveMessage(any(ReceiveMessageRequest.class))).thenThrow(RuntimeException.class);

        final List<Message> msgs = SQSUtils.getAllMessages(sqsClient, queueUrl, maxNumberOfMessages);
        assertTrue(msgs.isEmpty());
    }

    @Test
    void testGetAllMessagesWhenNoMessagesThenReturnEmptyList() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final String queueUrl = "test-queue-url";
        final int maxNumberOfMessages = 10;

        final ReceiveMessageResponse resp = ReceiveMessageResponse.builder().messages(Collections.emptyList()).build();
        when(sqsClient.receiveMessage(any(ReceiveMessageRequest.class))).thenReturn(resp);

        final List<Message> msgs = SQSUtils.getAllMessages(sqsClient, queueUrl, maxNumberOfMessages);
        assertTrue(msgs.isEmpty());
    }

    @Test
    void testGetAllMessagesBodyWhenSuccessThenReturnParseMessages() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final Gson gson = new Gson();
        final String queueUrl = "test-queue-url";
        final int maxNumberOfMessages = 10;
        record TestMessage(String testKey) {
        }
        final Message msg = Message.builder().body("{\"testKey\":\"testVal\"}").build();
        final ReceiveMessageResponse resp = ReceiveMessageResponse.builder().messages(msg).build();
        when(sqsClient.receiveMessage(any(ReceiveMessageRequest.class))).thenReturn(resp);

        final List<TestMessage> msgs = SQSUtils.getAllMessagesBody(sqsClient, queueUrl, maxNumberOfMessages, gson,
                TestMessage.class);
        assertEquals(1, msgs.size());
        assertEquals("testVal", msgs.get(0).testKey);
    }

    @Test
    void testGetAllMessagesBodyWhenExceptionThenReturnEmptyList() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final Gson gson = new Gson();
        final String queueUrl = "test-queue-url";
        final int maxNumberOfMessages = 10;
        record TestMessage(String testKey) {
        }
        when(sqsClient.receiveMessage(any(ReceiveMessageRequest.class))).thenThrow(RuntimeException.class);

        final List<TestMessage> msgs = SQSUtils.getAllMessagesBody(sqsClient, queueUrl, maxNumberOfMessages, gson,
                TestMessage.class);
        assertTrue(msgs.isEmpty());
    }

    @Test
    void testGetAllMessagesBodyWhenNoMessagesThenReturnEmptyList() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final Gson gson = new Gson();
        final String queueUrl = "test-queue-url";
        final int maxNumberOfMessages = 10;
        record TestMessage(String testKey) {
        }
        final ReceiveMessageResponse resp = ReceiveMessageResponse.builder().messages(Collections.emptyList()).build();
        when(sqsClient.receiveMessage(any(ReceiveMessageRequest.class))).thenReturn(resp);

        final List<TestMessage> msgs = SQSUtils.getAllMessagesBody(sqsClient, queueUrl, maxNumberOfMessages, gson,
                TestMessage.class);
        assertTrue(msgs.isEmpty());
    }

    @SuppressWarnings("unchecked")
    @Test
    void testSendMessageWhenSuccessThenLogMessage() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final Gson gson = new Gson();
        final String queueUrl = "test-queue-url";
        record TestMessage(String testKey) {
        }
        final TestMessage message = new TestMessage("value");
        SQSUtils.sendMessage(sqsClient, queueUrl, gson, message);

        // Verify that the method was called
        Mockito.verify(sqsClient).sendMessage(any(Consumer.class));
    }

    @SuppressWarnings("unchecked")
    @Test
    void testSendMessageWhenExceptionThenHandle() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final Gson gson = new Gson();
        final String queueUrl = "test-queue-url";
        record TestMessage(String testKey) {
        }
        final TestMessage message = new TestMessage("value");

        doThrow(RuntimeException.class).when(sqsClient).sendMessage(any(Consumer.class));
        SQSUtils.sendMessage(sqsClient, queueUrl, gson, message);
        verify(sqsClient).sendMessage(any(Consumer.class));
    }

    @SuppressWarnings("unchecked")
    @Test
    void testDeleteMessageWhenSuccessThenLogMessage() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final String queueUrl = "test-queue-url";
        final String receiptHandle = "test-receipt-handle";
        SQSUtils.deleteMessage(sqsClient, queueUrl, receiptHandle);

        // Verify that the method was called
        Mockito.verify(sqsClient).deleteMessage(any(Consumer.class));
    }

    @SuppressWarnings("unchecked")
    @Test
    void testDeleteMessageWhenExceptionThenHandle() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final String queueUrl = "test-queue-url";
        final String receiptHandle = "test-receipt-handle";

        doThrow(RuntimeException.class).when(sqsClient).deleteMessage(any(Consumer.class));
        SQSUtils.deleteMessage(sqsClient, queueUrl, receiptHandle);
        verify(sqsClient).deleteMessage(any(Consumer.class));
    }

    @SuppressWarnings("unchecked")
    @Test
    void testDeleteMessageWhenInvalidReceiptHandleThenHandle() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final String queueUrl = "test-queue-url";
        final String receiptHandle = "invalid-receipt-handle";

        doThrow(RuntimeException.class).when(sqsClient).deleteMessage(any(Consumer.class));
        SQSUtils.deleteMessage(sqsClient, queueUrl, receiptHandle);
        verify(sqsClient).deleteMessage(any(Consumer.class));
    }

    @SuppressWarnings("unchecked")
    @Test
    void testDeleteMessageWhenSuccessThenLogMessages() {
        final SqsClient sqsClient = Mockito.mock(SqsClient.class);
        final String queueUrl = "test-queue-url";
        final List<String> receiptHandleList = Arrays.asList("test-receipt-handle-1", "test-receipt-handle-2");
        SQSUtils.deleteMessages(sqsClient, queueUrl, receiptHandleList);

        // Verify that the method was called
        Mockito.verify(sqsClient, Mockito.times(2)).deleteMessage(any(Consumer.class));
    }

}
