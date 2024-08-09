package com.example.demo.redis;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.example.demo.redis.entity.Role;
import com.example.demo.redis.repo.RoleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class CreateRolesCmd implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role adminRole = Role.builder()
                    .name("admin").build();
            Role customerRole = Role.builder()
                    .name("customer").build();
            roleRepository.save(adminRole);
            roleRepository.save(customerRole);
            log.info("roles created...");
        }
    }

}
