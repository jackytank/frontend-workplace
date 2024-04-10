package com.examplebe.demo.learnwebsocket.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserRestController {
    private final UserService chatUserService;

    @GetMapping("/chatusers")
    public ResponseEntity<java.util.List<User>> findConnectedUsers() {
        return ResponseEntity.ok(chatUserService.findConnectedUsers());
    }
    
}
