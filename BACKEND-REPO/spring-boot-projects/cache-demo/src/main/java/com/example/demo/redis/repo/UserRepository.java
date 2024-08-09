package com.example.demo.redis.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.redis.entity.User;

import io.lettuce.core.dynamic.annotation.Param;

@Repository
public interface UserRepository extends CrudRepository<User, String> {
    User findFirstByEmail(@Param("email") String cc);
}
