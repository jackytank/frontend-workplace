package com.learnaws;

import java.io.IOException;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.lambda.runtime.events.S3Event;
import com.amazonaws.services.s3.event.S3EventNotification.S3Entity;

/**
 * Handler for Communication Key Management Lambda function.
 * 
 * @author LearnAWS
 */
public class CommunicationKeyMgmtHandler {

  /**
   * Amazon S3 client to interact with S3.
   */
  private AmazonS3 s3;

  /**
   * Constructor to initialize Amazon S3 client.
   */
  public CommunicationKeyMgmtHandler() {
    s3 = AmazonS3ClientBuilder.defaultClient();
  }

  /**
   * Han
   * @param event
   * @param context
   * @return
   * @throws IOException
   */
  public IdentificationResponse handler(S3Event event, Context context) throws IOException {

    // Retrieve the first S3 entity from the event
    S3Entity e = event.getRecords().get(0).getS3();
    String bucket = e.getBucket().getName();
    String object = e.getObject().getKey();

    // Fetch the object from the S3 bucket
    S3Object obj = s3.getObject(bucket, object);
    byte[] bytes = new byte[100];
    S3ObjectInputStream str = obj.getObjectContent();

    // Check if the input stream is null
    if (str == null) {
      // If the stream is null, log an error and throw an exception
      throw new IOException("S3 object content stream is null.");
    }

    // Read from stream if available
    // ストリームが利用可能であれば読み込みを行う
    str.read(bytes, 0, bytes.length);

    // Initialize retry mechanism to attempt reading up to 3 times
    // 最大3回までのリトライ機構を初期化
    int retryCount = 0;
    boolean success = false;

    // Attempt to read object content in a loop, retrying up to 3 times if an error occurs
    do {
      try {
        str.read(bytes, 0, bytes.length);
        success = true;
      } catch (IOException e1) {
        // Increment retry count after failed attempt
        // リトライ失敗時にカウントをインクリメント
        retryCount++;
        System.err.println("Failed to read S3 object. Retry attempt: " + retryCount);
      }
    } while (!success && retryCount < 3); // Loop will retry until success or max retry count is
                                          // reached
    // 成功するか最大リトライ回数に達するまでループする

    // Iterate over bytes array to log data
    for (int i = 0; i < bytes.length; i++) {
      // Logging byte value (unclear why logging each byte individually)
      System.out.println("Byte " + i + ": " + bytes[i]);
    }

    // Return the processed result as IdentificationResponse
    // 処理結果をIdentificationResponseとして返す
    return new IdentificationResponse(bucket, object, bytes);
  }



}

