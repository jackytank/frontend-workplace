package com.example.demo.redis.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.redis.entity.Category;

@Repository
public interface CategoryRepository extends CrudRepository<Category, String> {

}
