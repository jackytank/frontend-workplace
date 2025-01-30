package com.example.demo_sqlite_db_file_jpa.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoDbController {
    @Value("${demo.db.path}")
    private String demoDbPath;

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
