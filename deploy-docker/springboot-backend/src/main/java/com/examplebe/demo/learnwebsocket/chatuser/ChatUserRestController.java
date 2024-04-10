package com.examplebe.demo.learnwebsocket.chatuser;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ChatUserRestController {
    private final ChatUserService chatUserService;

    @GetMapping("/chatusers")
    public ResponseEntity<java.util.List<ChatUser>> findConnectedUsers() {
        return ResponseEntity.ok(chatUserService.findConnectedUsers());
    }
    
}
