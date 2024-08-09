package com.example.demo.redis.controller;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.redis.entity.User;
import com.example.demo.redis.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserRepository userRepository;

    @GetMapping("")
    public Iterable<User> all(
            @RequestParam(defaultValue = "") String email) {
        if (email.isEmpty()) {
            return userRepository.findAll();
        }
        Optional<User> user = Optional.ofNullable(userRepository.findFirstByEmail(email));
        return user.isPresent() ? List.of(user.get()) : Collections.emptyList();
    }
}
