package com.demo.learnwebsocket.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class wsUserRestController {
    private final wsUserService chatUserService;

    @GetMapping("/chatusers")
    public ResponseEntity<java.util.List<wsUser>> findConnectedUsers() {
        return ResponseEntity.ok(chatUserService.findConnectedUsers());
    }
    
}
