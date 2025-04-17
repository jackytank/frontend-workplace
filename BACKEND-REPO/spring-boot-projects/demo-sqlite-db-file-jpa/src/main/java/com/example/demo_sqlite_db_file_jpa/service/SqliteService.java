package com.example.demo_sqlite_db_file_jpa.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.demo_sqlite_db_file_jpa.entity.sqlite.Employee;
import com.example.demo_sqlite_db_file_jpa.repository.sqlite.EmployeeRepository;
import com.example.demo_sqlite_db_file_jpa.util.DynamicDataSourceFactory;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SqliteService {
    @Value("${sqlite-db-dir}")
    private final String sqliteDbDir;
    private final RestTemplate restTemplate;
    private final DynamicDataSourceFactory dynamicDataSourceFactory;
    private static final String SQLITE_EXTENSION = ".db";

    public List<Employee> processDatabase(String url) throws Exception {
        final Path dbDir = Paths.get(sqliteDbDir);
        Files.createDirectories(dbDir);

        final String dbFileName = "temp_%s%s".formatted(UUID.randomUUID(), SQLITE_EXTENSION);
        final Path dbPath = dbDir.resolve(dbFileName);

        final byte[] dbContent = restTemplate.getForObject(url, byte[].class);
        Files.write(dbPath, dbContent);

        List<Employee> result;
        try (EntityManagerFactory emf = dynamicDataSourceFactory.createEntityManagerFactory(dbPath.toString())
                .getObject();
                EntityManager em = emf.createEntityManager()) {

            final var repositoryFactory = new JpaRepositoryFactory(em);
            final var repository = repositoryFactory.getRepository(EmployeeRepository.class);
            result = repository.findAll();
        }
        return result;
    }
}
