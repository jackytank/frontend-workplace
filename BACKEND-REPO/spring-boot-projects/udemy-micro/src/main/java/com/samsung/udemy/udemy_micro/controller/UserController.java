package com.samsung.udemy.udemy_micro.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.samsung.udemy.udemy_micro.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

record BaseResponse(String message, Object data) {
}

@RestController
@RequiredArgsConstructor
@RequestMapping("/users-rest")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("")
    public ResponseEntity<BaseResponse> getUsers() {
        return ResponseEntity.ok(new BaseResponse("Users fetched successfully", null));
    }

}
