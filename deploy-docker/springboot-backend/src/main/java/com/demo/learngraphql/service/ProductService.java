package com.demo.learngraphql.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.demo.learngraphql.entity.Product;
import com.demo.learngraphql.model.ProductModel;
import com.demo.learngraphql.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ProductService {
    private final ProductRepository productRepository;

    public List<ProductModel> getProducts() {
        return productRepository.findAll().stream()
                .map(product -> ProductModel.builder()
                        .id(product.getId())
                        .name(product.getName())
                        .price(product.getPrice())
                        .description(product.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    private void createProduct() {
        Product product = Product.builder()
                .name("Product 1")
                .price(100.0f)
                .description("Product 1 description")
                .build();
        productRepository.save(product);
    }

}
