package com.cipherian.cipherianmongodb.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cipherian.cipherianmongodb.model.User;
import com.cipherian.cipherianmongodb.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("/")
    public ResponseEntity<List<User>> getAll() {
        // return ResponseEntity.ok(userRepository.findAll());
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getOne(@PathVariable(name = "id") String id){
        return ResponseEntity.ok(null);
        // return ResponseEntity.ok(userRepository.findOne(id));
    }

}
