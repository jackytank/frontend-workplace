package com.research.sql_analyzer.research_sql_analyzer;

import com.research.sql_analyzer.research_sql_analyzer.service.MyAnalyzeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
@RequiredArgsConstructor
public class ResearchSqlAnalyzerApplication implements CommandLineRunner {

	private final MyAnalyzeService crudAnalyzerService;

	public static void main(String[] args) {
		SpringApplication.run(ResearchSqlAnalyzerApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		log.info("=== Starting CRUD Analyzer ===");
		crudAnalyzerService.analyze();
		log.info("=== CRUD Analyzer Finished ===");
	}
}
