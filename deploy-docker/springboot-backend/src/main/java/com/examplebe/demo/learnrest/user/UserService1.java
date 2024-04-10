package com.examplebe.demo.learnrest.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService1 {

    private final UserRepo1 userRepo;

    @Cacheable(value = "users")
    public List<UserResponse> getAllUsers() {
        System.out.println("UserService::getAllUsers - Get all users");
        return userRepo.findAll().stream()
                .map(user -> UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail()).build())
                .collect(Collectors.toList());
    }

    public ResponseEntity<UserResponse> getUserById(Long id) {
        if (id == null)
            return ResponseEntity.badRequest().build();
        return userRepo.findById(id)
                .map(user -> ResponseEntity.ok(UserResponse.builder()
                        .name(user.getName())
                        .email(user.getEmail()).build()))
                .orElse(ResponseEntity.notFound().build());
    }

    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> updateUser(Long id, UserRequest userRequest) {
        if (id == null)
            return ResponseEntity.badRequest().build();
        return userRepo.findById(id)
                .map(userEntity -> {
                    userEntity.setName(userRequest.name());
                    userEntity.setEmail(userRequest.email());
                    userRepo.save(userEntity);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // delete cache
    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> createUser(UserRequestWithPassword userRequestWithPassword) {
        User1 userEntity = User1.builder()
                .name(userRequestWithPassword.name())
                .email(userRequestWithPassword.email())
                .password(userRequestWithPassword.password()).build();
        if (userEntity == null)
            return ResponseEntity.badRequest().build();
        if (userRepo.existsByEmail(userRequestWithPassword.email()))
            return ResponseEntity.badRequest().body("Email already exists");
        var updated = userRepo.save(userEntity);
        return ResponseEntity.ok(updated);
    }

    @CacheEvict(value = "users", allEntries = true)
    public ResponseEntity<?> deleteUser(Long id) {
        if (id == null)
            return ResponseEntity.badRequest().build();
        return userRepo.findById(id)
                .map(user -> {
                    userRepo.delete(user);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
