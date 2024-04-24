package com.demo.learngraphql.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.learngraphql.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
