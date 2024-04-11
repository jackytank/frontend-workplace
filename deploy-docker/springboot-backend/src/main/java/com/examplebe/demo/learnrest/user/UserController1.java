package com.examplebe.demo.learnrest.user;

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
import java.util.concurrent.atomic.AtomicInteger;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/users")
public class UserController1 {

    private final UserService1 userService;
    private final AtomicInteger requestCount = new AtomicInteger(0);

    @GetMapping("")
    public ResponseEntity<List<?>> getUsers() {
        int currentCount = requestCount.incrementAndGet();
        if (currentCount >= 3) {
            // Simulate a server crash after 3 requests
            System.exit(1);
        }

        // Get the process ID (PID)
        long pid = ProcessHandle.current().pid();
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
            @Valid @RequestBody UserRequest userRequest,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors())
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        return userService.updateUser(id, userRequest);
    }

    @PostMapping("")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequestWithPassword userRequestWithPassword,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors())
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        return userService.createUser(userRequestWithPassword);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
}
