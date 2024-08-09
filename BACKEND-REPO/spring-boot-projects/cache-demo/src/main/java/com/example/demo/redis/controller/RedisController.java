package com.example.demo.redis.controller;

import java.util.Map;
import java.util.Objects;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/v1/redis")
public class RedisController {

    private final RedisTemplate<String, String> t;

    private static final String STRING_KEY_PREFIX = "employees:strings:";

    private static int counter = 0;

    @PostMapping("/strings")
    public ResponseEntity<Map.Entry<String, String>> setString(@RequestBody Map.Entry<String, String> map) {
        counter++;
        log.info("counter: {}", counter);
        t.opsForValue().set(STRING_KEY_PREFIX + map.getKey(), map.getValue());
        return ResponseEntity.ok().body(map);
    }

    @GetMapping("/strings/{key}")
    public ResponseEntity<Map.Entry<String, String>> getStringRedis(@PathVariable String key) {
        String val = t.opsForValue().get(STRING_KEY_PREFIX + key);
        if (Objects.isNull(val))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "key not found");
        return ResponseEntity.ok().body(Map.entry(key, val));
    }

}
