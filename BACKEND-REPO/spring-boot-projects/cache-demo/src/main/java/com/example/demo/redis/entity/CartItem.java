package com.example.demo.redis.entity;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItem {
    private String id;
    private Long quantity;
    private Double price;
}
