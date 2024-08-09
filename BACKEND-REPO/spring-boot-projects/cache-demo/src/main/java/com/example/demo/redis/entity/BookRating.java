package com.example.demo.redis.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Reference;
import org.springframework.data.redis.core.RedisHash;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash
public class BookRating {
    @Id
    private String id;
    @NotNull
    @Reference
    private User user;

    @NotNull
    @Reference
    private Book book;

    @NotNull
    private Integer rating;
}
