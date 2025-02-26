package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RequiredArgsConstructor
@RequestMapping("/api/v1/data-logs")
@RestController
public class DataLogController {

    @GetMapping("")
    public String getAll(@RequestParam(required = false) String param) {
        return "helloworld";
    }
    
}
