package com.examplebe.demo.user;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/users")
public class UserController {

    private final UserRepo userRepo;

    // GET request to get all users
    @GetMapping("")
    public ResponseEntity<List<?>> getUsers() {
        // return list of record UserResponse
        System.out.println("UserController::getUse2rs - Get all users");
        return ResponseEntity.ok(userRepo.findAll().stream()
                .map(user -> {
                    return UserResponse.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .email(user.getEmail()).build();
                })
                .toList());

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        if (id == null)
            return ResponseEntity.badRequest().build();
        // builder to return only name, email, ignore password and other fields
        return userRepo.findById(id)
                .map(user -> ResponseEntity.ok(UserResponse.builder()
                        .name(user.getName())
                        .email(user.getEmail()).build()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
            @Valid @RequestBody UserRequest user,
            BindingResult bindingResult) {
        if (id == null)
            return ResponseEntity.badRequest().build();
        if (bindingResult.hasErrors())
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        return userRepo.findById(id)
                .map(userEntity -> {
                    userEntity.setName(user.name());
                    userEntity.setEmail(user.email());
                    userRepo.save(userEntity);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequestWithPassword user,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors())
            // return only messages
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        User userEntity = User.builder()
                .name(user.name())
                .email(user.email())
                .password(user.password()).build();
        if (userEntity == null)
            return ResponseEntity.badRequest().build();
        // check exist email
        if (userRepo.existsByEmail(user.email()))
            return ResponseEntity.badRequest().body("Email already exists");
        var updated = userRepo.save(userEntity);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
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
