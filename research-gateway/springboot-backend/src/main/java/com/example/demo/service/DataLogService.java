package com.example.demo.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class DataLogService {

    @Cacheable(value = "dataLogCache")
    public String getAll(String param) {
        System.out.println("getAll called");
        return "Hello World!";
    }

    

}
