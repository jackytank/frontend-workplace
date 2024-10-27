package com.example.aws.aws_learn.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/v1/sqs")
public class SqsController {
    @GetMapping("")
    public ResponseEntity<?> getAllMessages() {
        return ResponseEntity.ok(List.of("Message 1", "Message 2", "Message 3"));
    }
}
