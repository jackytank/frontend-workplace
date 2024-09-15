package com.learnaws;

import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * This class represents the return object for the Lambda function.
 * 
 * @author LearnAWS
 */
@Setter
@Getter
@AllArgsConstructor
public class IdentificationResponse {

  /**
   * The identification information. 識別情報。
   */
  private String identification;

  /**
   * The type of the key. キーの種類。
   */
  private String keyType;

  /**
   * Byte data representing the instruments. 楽器データ
   */
  private byte[] instruments;
}
