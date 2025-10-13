package com.research.sql_analyzer.research_sql_analyzer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.research.sql_analyzer.research_sql_analyzer.analyzer.MyAnalyzer;
import com.research.sql_analyzer.research_sql_analyzer.config.AnalyzeConfigProperties;
import com.research.sql_analyzer.research_sql_analyzer.model.MyAnalysisResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class MyAnalyzeService {

    private final AnalyzeConfigProperties analyzeConfig;
    private final MyAnalyzer xmlAnalyzer;
    private final ObjectMapper objectMapper;

    public void analyze() {
        try {
            log.info("Starting CRUD Analysis...");
            
            // Find all XML files in resources
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath*:**/*.xml");
            
            List<MyAnalysisResult> allResults = new ArrayList<>();
            
            // Process each configured file
            for (AnalyzeConfigProperties.FileConfig fileConfig : analyzeConfig.getAnalyzeConfig()) {
                String filename = fileConfig.getFilename();
                List<String> methodsToFind = fileConfig.getMethodsToFind();
                
                log.info("Processing file: {}", filename);
                
                // Find the matching XML file
                Optional<Resource> matchingResource = Arrays.stream(resources)
                        .filter(r -> r.getFilename() != null && r.getFilename().equals(filename))
                        .findFirst();
                
                if (matchingResource.isEmpty()) {
                    log.warn("File not found: {}", filename);
                    continue;
                }
                
                Resource resource = matchingResource.get();
                File xmlFile = resource.getFile();
                
                MyAnalysisResult result = new MyAnalysisResult();
                result.setFile(xmlFile.getAbsolutePath());
                result.setMethods(new ArrayList<>());
                
                // Analyze each method
                for (String methodId : methodsToFind) {
                    log.info("Analyzing method: {}", methodId);
                    
                    Map<String, Map<String, String>> tableOps = xmlAnalyzer.analyzeMethod(xmlFile, methodId);
                    
                    if (!tableOps.isEmpty()) {
                        MyAnalysisResult.MethodAnalysis methodAnalysis = new MyAnalysisResult.MethodAnalysis();
                        methodAnalysis.setName(methodId);
                        
                        List<Map<String, String>> analysisList = new ArrayList<>();
                        for (Map.Entry<String, Map<String, String>> entry : tableOps.entrySet()) {
                            analysisList.add(entry.getValue());
                        }
                        
                        methodAnalysis.setAnalysis(analysisList);
                        result.getMethods().add(methodAnalysis);
                    }
                }
                
                if (!result.getMethods().isEmpty()) {
                    allResults.add(result);
                }
            }
            
            // Write results to JSON file
            writeResultsToJson(allResults);
            
            log.info("Analysis completed successfully!");
            
        } catch (Exception e) {
            log.error("Error during analysis", e);
        }
    }

    private void writeResultsToJson(List<MyAnalysisResult> results) {
        try {
            // Create output directory if it doesn't exist
            File outputDir = new File("output");
            if (!outputDir.exists()) {
                outputDir.mkdirs();
            }
            
            File outputFile = new File(outputDir, "crud-analysis-result.json");
            
            objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
            objectMapper.writeValue(outputFile, results);
            
            log.info("Results written to: {}", outputFile.getAbsolutePath());
            
        } catch (Exception e) {
            log.error("Error writing results to JSON", e);
        }
    }
}
