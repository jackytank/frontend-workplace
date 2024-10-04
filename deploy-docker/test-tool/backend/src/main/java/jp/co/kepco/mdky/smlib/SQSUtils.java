package jp.co.kepco.mdky.smlib;

import com.google.gson.Gson;
import lombok.experimental.UtilityClass;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import software.amazon.awssdk.services.sqs.SqsClient;
import software.amazon.awssdk.services.sqs.model.Message;
import software.amazon.awssdk.services.sqs.model.ReceiveMessageRequest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * SQS handler
 */
@UtilityClass
public class SQSUtils {

    /**
     * Logger to log messages
     */
    private final Logger logger = LogManager.getLogger(SQSUtils.class);

    /**
     * Fetch messages from SQS
     * 
     * @param sqsClient SQS client
     * @param queueUrl SQS queue URL
     * @param maxNumberOfMessages Maximum number of messages to fetch
     * @return List of messages of type {@link Message}
     */
    private List<Message> fetchMessages(SqsClient sqsClient, String queueUrl,
            int maxNumberOfMessages) {
        final ReceiveMessageRequest receiveMessageRequest = ReceiveMessageRequest.builder()
                .queueUrl(queueUrl).maxNumberOfMessages(maxNumberOfMessages).build();
        return sqsClient.receiveMessage(receiveMessageRequest).messages().stream().collect(
                Collectors.collectingAndThen(Collectors.toList(), Collections::unmodifiableList));
    }

    /**
     * Get all messages from SQS
     * 
     * @param sqsClient SQS client
     * @param queueUrl SQS queue URL
     * @param maxNumberOfMessages Maximum number of messages to fetch
     * @return List of messages of type {@link Message}
     */
    public List<Message> getAllMessages(SqsClient sqsClient, String queueUrl,
            int maxNumberOfMessages) {
        try {
            return fetchMessages(sqsClient, queueUrl, maxNumberOfMessages);
        } catch (Exception e) {
            logger.trace(">> SQSUtils.getAllMessages - Error while getting messages from SQS", e);
            return Collections.emptyList();
        }
    }

    /**
     * Get all messages from SQS and parse them to the specified class
     * 
     * @param <T> the type of the class
     * @param sqsClient SQS client
     * @param queueUrl SQS queue URL
     * @param maxNumberOfMessages Maximum number of messages to fetch
     * @param gson Gson instance
     * @param clazz the class to parse the messages to
     * @return List of messages of type {@link T}
     */
    public <T> List<T> getAllMessagesBody(SqsClient sqsClient, String queueUrl,
            int maxNumberOfMessages, Gson gson, Class<T> clazz) {
        List<Message> messages = getAllMessages(sqsClient, queueUrl, maxNumberOfMessages);
        List<T> result = new ArrayList<>();
        for (Message message : messages) {
            try {
                result.add(gson.fromJson(message.body(), clazz));
            } catch (Exception e) {
                logger.trace(">> SQSUtils.getAllMessages - Error while parsing message to clazz: %s"
                        .formatted(clazz.getName()), e);
            }
        }
        logger.info(">> SQSUtils.getAllMessages - Messages: {}", result);
        return result;
    }

    /**
     * Send a message to SQS
     * 
     * @param sqsClient SQS client
     * @param queueUrl SQS queue URL
     * @param gson Gson instance
     * @param object Object to send
     */
    public static void sendMessage(SqsClient sqsClient, String queueUrl, Gson gson, Object object) {
        try {
            sqsClient.sendMessage(
                    builder -> builder.queueUrl(queueUrl).messageBody(gson.toJson(object)));
            logger.info(">> SQSUtils.sendMessage - Message sent to SQS: {}", object);
        } catch (Exception e) {
            logger.trace(">> SQSUtils.sendMessage - Error while sending message to SQS", e);
        }
    }

    /**
     * Delete a message from SQS
     * 
     * @param sqsClient SQS client
     * @param queueUrl SQS queue URL
     * @param receiptHandle Receipt handle of the message to delete
     */
    public static void deleteMessage(SqsClient sqsClient, String queueUrl, String receiptHandle) {
        try {
            sqsClient.deleteMessage(
                    builder -> builder.queueUrl(queueUrl).receiptHandle(receiptHandle));
            logger.info(">> SQSUtils.deleteMessage - Message deleted from SQS, receiptHandle: {}",
                    receiptHandle);
        } catch (Exception e) {
            logger.trace(">> SQSUtils.deleteMessage - Error while deleting message from SQS", e);
        }
    }

    /**
     * Delete messages from SQS
     * 
     * @param sqsClient SQS client
     * @param queueUrl SQS queue URL
     * @param messages List of messages to delete
     */
    public static void deleteMessages(SqsClient sqsClient, String queueUrl,
            List<String> receiptHandleList) {
        for (String receiptHandle : receiptHandleList) {
            deleteMessage(sqsClient, queueUrl, receiptHandle);
        }
    }

}
