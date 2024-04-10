package com.examplebe.demo.rest.user;

import java.io.Serializable;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

record UserRequest(
        @NotBlank(message = "Name is required") String name,
        @Email(message = "Email is mandatory") String email) {
}

// extends UserRequest to include password
record UserRequestWithPassword(
        @NotBlank(message = "Name is required") String name,
        @Email(message = "Email is mandatory") String email,
        String password) {
}

@Builder
record UserResponse(Long id, String name, String email) implements Serializable {
    private static final long serialVersionUID = 1L;
}
