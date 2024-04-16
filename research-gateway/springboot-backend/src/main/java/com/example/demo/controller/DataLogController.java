package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.DataLogService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RequiredArgsConstructor
@RequestMapping("/api/v1/data-logs")
@RestController
public class DataLogController {
    private final DataLogService dataLogService;

    @GetMapping("")
    public String getAll(@RequestParam String param) {
        return dataLogService.getAll(param);
    }
    
}
