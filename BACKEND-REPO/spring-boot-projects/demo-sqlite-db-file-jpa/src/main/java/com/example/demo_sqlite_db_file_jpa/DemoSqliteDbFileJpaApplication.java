package com.example.demo_sqlite_db_file_jpa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DemoSqliteDbFileJpaApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoSqliteDbFileJpaApplication.class, args);
	}

}
