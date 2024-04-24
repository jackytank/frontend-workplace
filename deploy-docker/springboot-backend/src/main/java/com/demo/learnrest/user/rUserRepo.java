package com.demo.learnrest.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface rUserRepo extends JpaRepository<rUser, Long> {
    boolean existsByEmail(String email);
}
