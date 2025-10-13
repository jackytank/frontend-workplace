package com.research.sql_analyzer.research_sql_analyzer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyAnalysisResult {
    private String file;
    private List<MethodAnalysis> methods;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MethodAnalysis {
        private String name;
        private List<Map<String, String>> analysis;
    }
}
