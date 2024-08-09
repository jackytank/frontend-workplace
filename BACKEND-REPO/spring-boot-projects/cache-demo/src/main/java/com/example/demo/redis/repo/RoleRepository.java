package com.example.demo.redis.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.redis.entity.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, String> {
    Role findFirstByName(String role);
}