package com.example.demo_sqlite_db_file_jpa.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo_sqlite_db_file_jpa.dto.SqliteReadRequest;
import com.example.demo_sqlite_db_file_jpa.entity.Employee;
import com.example.demo_sqlite_db_file_jpa.service.SqliteService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
public class SqliteController {
    private final SqliteService sqliteService;

    @PostMapping("/read-sqlite")
    public ResponseEntity<List<Employee>> readSqlite(@RequestBody SqliteReadRequest request) {
        try {
            final var employees = sqliteService.processDatabase(request.url());
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            log.error("Error reading SQLite database", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
