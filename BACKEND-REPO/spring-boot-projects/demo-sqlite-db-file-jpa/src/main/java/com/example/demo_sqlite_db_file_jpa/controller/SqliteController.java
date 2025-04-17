package com.example.demo_sqlite_db_file_jpa.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo_sqlite_db_file_jpa.dto.SqliteReadRequest;
import com.example.demo_sqlite_db_file_jpa.entity.sqlite.Employee;
import com.example.demo_sqlite_db_file_jpa.service.SqliteService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
public class SqliteController {
    private final SqliteService sqliteService;
    @Value("${demo.db.path}")
    private String demoDbPath;

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

    @GetMapping("/download-demo-db-file")
    public ResponseEntity<Resource> downloadDemoDb() {
        final Resource resource = new FileSystemResource(demoDbPath);

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=demo.db")
                .body(resource);
    }

}
