package com.example.demo_sqlite_db_file_jpa.scheduler;

import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class FileScheduler {
    @Value("${sqlite-db-dir}")
    private final String sqliteDbDir;

    @Scheduled(fixedRate = 1000)
    public void processDatabase() {
        try {
            Files.list(Path.of(sqliteDbDir))
                    .filter(path -> path.toString().endsWith(".db"))
                    .sorted((p1, p2) -> {
                        try {
                            return Files.getLastModifiedTime(p1).compareTo(Files.getLastModifiedTime(p2));
                        } catch (Exception e) {
                            return 0;
                        }
                    })
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (Exception e) {
                            log.error("Error deleting file: {}, {}", path, e.getMessage());
                        }
                    });
        } catch (Exception e) {
            log.error("Error in scheduling files {}", e.getMessage());
        }
    }
}
