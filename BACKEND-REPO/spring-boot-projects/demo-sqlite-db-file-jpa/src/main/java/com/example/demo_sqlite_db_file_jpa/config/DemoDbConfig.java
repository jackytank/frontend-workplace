package com.example.demo_sqlite_db_file_jpa.config;

import java.nio.file.Files;
import java.nio.file.Path;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.DataSourceInitializer;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;

@Configuration
public class DemoDbConfig {
    @Value("${demo.db.path}")
    private String demoDbPath;

    @Bean
    public DataSource demoDataSource() throws Exception {
        // Ensure target directory exists
        final Path dbPath = Path.of(demoDbPath);
        Files.createDirectories(dbPath.getParent());

        return DataSourceBuilder.create()
                .driverClassName("org.sqlite.JDBC")
                .url("jdbc:sqlite:" + demoDbPath)
                .build();
    }

    @Bean
    DataSourceInitializer demoDataSourceInitializer(DataSource demoDataSource) {
        final var initializer = new DataSourceInitializer();
        initializer.setDataSource(demoDataSource);

        final var databasePopulator = new ResourceDatabasePopulator();
        databasePopulator.addScript(new ClassPathResource("db/demo/schema.sql"));
        databasePopulator.addScript(new ClassPathResource("db/demo/data.sql"));
        databasePopulator.setSqlScriptEncoding("UTF-8");

        initializer.setDatabasePopulator(databasePopulator);
        return initializer;
    }
}
