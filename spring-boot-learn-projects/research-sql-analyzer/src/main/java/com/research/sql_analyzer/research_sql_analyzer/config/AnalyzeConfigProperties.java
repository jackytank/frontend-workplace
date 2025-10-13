package com.research.sql_analyzer.research_sql_analyzer.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "app")
public class AnalyzeConfigProperties {
    private List<FileConfig> analyzeConfig;

    @Data
    public static class FileConfig {
        private String filename;
        private List<String> methodsToFind;
    }
}
