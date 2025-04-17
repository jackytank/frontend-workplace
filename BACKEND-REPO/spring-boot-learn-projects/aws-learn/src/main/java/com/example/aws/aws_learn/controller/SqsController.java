package com.example.aws.aws_learn.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

record SqsMessage(
        String messageId,
        String receiptHandle,
        String body,
        Map<String, String> attributes,
        Map<String, String> messageAttributes,
        String md5OfBody) {
}

@RestController
@RequestMapping("/api/v1/sqs")
public class SqsController {
    @CrossOrigin
    @GetMapping("")
    public ResponseEntity<List<SqsMessage>> getSqsMessages() {
        List<SqsMessage> messages = List.of(
                new SqsMessage(
                        "1",
                        "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
                        "This is the first message body",
                        Map.of("Attribute1", "Value1", "Attribute2", "Value2"),
                        Map.of("MessageAttribute1", "Value1", "MessageAttribute2", "Value2"),
                        "d41d8cd98f00b204e9800998ecf8427e"),
                new SqsMessage(
                        "2",
                        "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0b...",
                        "This is the second message body",
                        Map.of("Attribute1", "Value1", "Attribute2", "Value2"),
                        Map.of("MessageAttribute1", "Value1", "MessageAttribute2", "Value2"),
                        "d41d8cd98f00b204e9800998ecf8427e"),
                new SqsMessage(
                        "3",
                        "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0c...",
                        "This is the third message body",
                        Map.of("Attribute1", "Value1", "Attribute2", "Value2"),
                        Map.of("MessageAttribute1", "Value1", "MessageAttribute2", "Value2"),
                        "d41d8cd98f00b204e9800998ecf8427e"));
        return ResponseEntity.ok(messages);
    }
}
