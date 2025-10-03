package com.example.demo.redis;

import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.redis.entity.Role;
import com.example.demo.redis.entity.User;
import com.example.demo.redis.repo.RoleRepository;
import com.example.demo.redis.repo.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class CreateUsersCmd implements CommandLineRunner {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findFirstByName("admin");
            Role customerRole = roleRepository.findFirstByName("customer");

            try (FileReader reader = new FileReader("src/main/resources/data/users/users.json")) {
                Gson gson = new Gson();
                java.lang.reflect.Type typeToken = new TypeToken<List<User>>() {
                }.getType();
                List<User> users = gson.fromJson(reader, typeToken);
                users.stream().forEach(user -> {
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                    user.addRole(customerRole);
                    userRepository.save(user);
                });
                log.info(">>>> users (" + users.size() + ") created...");
            } catch (IOException e) {
                log.info(">>>> Unable to save users: {}", e.getMessage());
            }

            User adminUser = new User();
            adminUser.setName("Adminus Admistradore");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("Reindeer Flotilla"));//
            adminUser.addRole(adminRole);
            userRepository.save(adminUser);
            log.info(">>>> Loaded User Data and Created users...");
        }
    }

}
