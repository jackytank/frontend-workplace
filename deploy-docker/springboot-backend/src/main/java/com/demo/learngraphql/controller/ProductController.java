package com.demo.learngraphql.controller;

import java.util.List;

import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import com.demo.learngraphql.model.ProductModel;
import com.demo.learngraphql.service.ProductService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
public class ProductController {
    private final ProductService productService;

    @QueryMapping 
    public List<ProductModel> products() {
        return productService.getProducts();
    }

    
}
