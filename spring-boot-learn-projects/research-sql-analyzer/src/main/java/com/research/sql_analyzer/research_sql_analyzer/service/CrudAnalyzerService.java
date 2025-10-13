package com.research.sql_analyzer.research_sql_analyzer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.research.sql_analyzer.research_sql_analyzer.analyzer.MyBatisSqlAnalyzer;
import com.research.sql_analyzer.research_sql_analyzer.config.AnalyzeConfigProperties;
import com.research.sql_analyzer.research_sql_analyzer.model.MyAnalysisResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class CrudAnalyzerService {

    private final AnalyzeConfigProperties configProperties;
    private final MyBatisSqlAnalyzer sqlAnalyzer;
    private final ObjectMapper objectMapper;

    /**
     * Main entry point for analyzing MyBatis XML files
     */
    public void analyze() {
        try {
            log.info("Starting CRUD analysis...");
            
            // Find all MyBatis XML files in src/main/resources
            Map<String, File> xmlFiles = findMyBatisXmlFiles();
            log.info("Found {} MyBatis XML files", xmlFiles.size());
            
            // Process each configured file
            List<MyAnalysisResult> results = new ArrayList<>();
            
            for (AnalyzeConfigProperties.FileConfig fileConfig : configProperties.getAnalyzeConfig()) {
                String filename = fileConfig.getFilename();
                List<String> methodsToFind = fileConfig.getMethodsToFind();
                
                log.info("Processing file: {} with methods: {}", filename, methodsToFind);
                
                File xmlFile = xmlFiles.get(filename);
                if (xmlFile == null) {
                    log.warn("XML file '{}' not found in resources", filename);
                    continue;
                }
                
                // Analyze the file
                Map<String, Map<String, String>> analysisResults = 
                        sqlAnalyzer.analyzeFile(xmlFile, methodsToFind);
                
                // Convert to result model
                MyAnalysisResult result = convertToResultModel(xmlFile, analysisResults);
                results.add(result);
                
                log.info("Analyzed file: {} - Found {} methods", filename, analysisResults.size());
            }
            
            // Write results to JSON file
            writeResultsToJson(results);
            
            log.info("CRUD analysis completed successfully");
            
        } catch (Exception e) {
            log.error("Error during CRUD analysis", e);
            throw new RuntimeException("Failed to complete CRUD analysis", e);
        }
    }

    /**
     * Find all MyBatis XML files in src/main/resources
     */
    private Map<String, File> findMyBatisXmlFiles() throws IOException {
        Map<String, File> xmlFiles = new HashMap<>();
        
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath*:**/*.xml");
        
        for (Resource resource : resources) {
            try {
                File file = resource.getFile();
                String filename = file.getName();
                xmlFiles.put(filename, file);
                log.debug("Found XML file: {}", filename);
            } catch (IOException e) {
                log.debug("Skipping resource: {} (not a file)", resource.getDescription());
            }
        }
        
        return xmlFiles;
    }

    /**
     * Convert analysis results to the output model
     */
    private MyAnalysisResult convertToResultModel(File xmlFile, 
                                                   Map<String, Map<String, String>> analysisResults) {
        MyAnalysisResult result = new MyAnalysisResult();
        result.setFile(xmlFile.getAbsolutePath());
        
        List<MyAnalysisResult.MethodAnalysis> methods = new ArrayList<>();
        
        for (Map.Entry<String, Map<String, String>> entry : analysisResults.entrySet()) {
            String methodName = entry.getKey();
            Map<String, String> tableOperations = entry.getValue();
            
            MyAnalysisResult.MethodAnalysis methodAnalysis = new MyAnalysisResult.MethodAnalysis();
            methodAnalysis.setName(methodName);
            
            // Convert map to list of single-entry maps
            List<Map<String, String>> analysisList = new ArrayList<>();
            for (Map.Entry<String, String> tableEntry : tableOperations.entrySet()) {
                Map<String, String> singleEntryMap = new LinkedHashMap<>();
                singleEntryMap.put(tableEntry.getKey(), tableEntry.getValue());
                analysisList.add(singleEntryMap);
            }
            
            methodAnalysis.setAnalysis(analysisList);
            methods.add(methodAnalysis);
        }
        
        result.setMethods(methods);
        return result;
    }

    /**
     * Write results to JSON file
     */
    private void writeResultsToJson(List<MyAnalysisResult> results) throws IOException {
        // Create output directory if it doesn't exist
        Path outputDir = Paths.get("output");
        if (!Files.exists(outputDir)) {
            Files.createDirectories(outputDir);
        }
        
        // Write to JSON file
        Path outputFile = outputDir.resolve("crud-analysis-result.json");
        
        ObjectMapper prettyMapper = objectMapper.copy();
        prettyMapper.enable(SerializationFeature.INDENT_OUTPUT);
        
        prettyMapper.writeValue(outputFile.toFile(), results);
        
        log.info("Results written to: {}", outputFile.toAbsolutePath());
    }
}
