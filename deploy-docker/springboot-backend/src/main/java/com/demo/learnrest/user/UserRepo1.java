package com.demo.learnrest.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo1 extends JpaRepository<User1, Long> {
    boolean existsByEmail(String email);
}
