package com.example.demo.redis.entity;

import java.util.Set;

import lombok.Builder;
import lombok.Data;
import lombok.Singular;

@Data
@Builder
public class Cart {
    private String id;
    private String userId;

    @Singular
    private Set<CartItem> cartItems;

    public Integer count() {
        return getCartItems().size();
    }

    public Double getTotal() {
        return cartItems.stream()
                .mapToDouble(e -> e.getPrice() * e.getQuantity())
                .sum();
    }
}
