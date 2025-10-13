package com.research.sql_analyzer.research_sql_analyzer.analyzer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.File;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
public class MyAnalyzer {

    // Regex patterns for SQL operations
    private static final Pattern SELECT_PATTERN = Pattern.compile(
            "select\\s+(?!1\\s+from)(.+?)\\s+from\\s+(\\w+)",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );
    
    private static final Pattern UPDATE_PATTERN = Pattern.compile(
            "update\\s+(\\w+)",
            Pattern.CASE_INSENSITIVE
    );
    
    private static final Pattern INSERT_PATTERN = Pattern.compile(
            "insert\\s+into\\s+(\\w+)",
            Pattern.CASE_INSENSITIVE
    );
    
    private static final Pattern DELETE_PATTERN = Pattern.compile(
            "delete\\s+from\\s+(\\w+)",
            Pattern.CASE_INSENSITIVE
    );

    // Pattern to find all table references in FROM, JOIN clauses
    private static final Pattern FROM_JOIN_PATTERN = Pattern.compile(
            "(?:from|join)\\s+(\\w+)",
            Pattern.CASE_INSENSITIVE
    );

    public Map<String, Map<String, String>> analyzeMethod(File xmlFile, String methodId) {
        Map<String, Map<String, String>> tableOperations = new HashMap<>();
        
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(xmlFile);
            doc.getDocumentElement().normalize();

            // Find the SQL tag with the matching id
            Element sqlElement = findElementById(doc, methodId);
            
            if (sqlElement == null) {
                log.warn("Method '{}' not found in file: {}", methodId, xmlFile.getAbsolutePath());
                return tableOperations;
            }

            // Get the complete SQL content including referenced <include> tags
            String sqlContent = getSqlContent(doc, sqlElement);
            
            // Analyze the SQL content
            analyzeTableOperations(sqlContent, tableOperations);
            
        } catch (Exception e) {
            log.error("Error analyzing XML file: {}", xmlFile.getAbsolutePath(), e);
        }
        
        return tableOperations;
    }

    private Element findElementById(Document doc, String id) {
        // Check all SQL statement tags: select, insert, update, delete, sql
        String[] tagNames = {"select", "insert", "update", "delete", "sql"};
        
        for (String tagName : tagNames) {
            NodeList nodeList = doc.getElementsByTagName(tagName);
            for (int i = 0; i < nodeList.getLength(); i++) {
                Element element = (Element) nodeList.item(i);
                if (id.equals(element.getAttribute("id"))) {
                    return element;
                }
            }
        }
        
        return null;
    }

    private String getSqlContent(Document doc, Element element) {
        StringBuilder content = new StringBuilder();
        
        // Get direct text content
        content.append(getTextContent(element));
        
        // Process <include> tags
        NodeList includeNodes = element.getElementsByTagName("include");
        for (int i = 0; i < includeNodes.getLength(); i++) {
            Element includeElement = (Element) includeNodes.item(i);
            String refId = includeElement.getAttribute("refid");
            
            // Find the referenced <sql> tag
            Element referencedSql = findElementById(doc, refId);
            if (referencedSql != null) {
                content.append(" ").append(getSqlContent(doc, referencedSql));
            }
        }
        
        return content.toString();
    }

    private String getTextContent(Element element) {
        StringBuilder text = new StringBuilder();
        NodeList childNodes = element.getChildNodes();
        
        for (int i = 0; i < childNodes.getLength(); i++) {
            Node node = childNodes.item(i);
            if (node.getNodeType() == Node.TEXT_NODE || node.getNodeType() == Node.CDATA_SECTION_NODE) {
                text.append(node.getTextContent()).append(" ");
            }
        }
        
        return text.toString();
    }

    private void analyzeTableOperations(String sql, Map<String, Map<String, String>> tableOperations) {
        // Clean up SQL for better parsing
        String cleanSql = cleanSql(sql);
        
        // Find all INSERT operations
        Matcher insertMatcher = INSERT_PATTERN.matcher(cleanSql);
        while (insertMatcher.find()) {
            String tableName = insertMatcher.group(1).toUpperCase();
            addOperation(tableOperations, tableName, "C");
        }
        
        // Find all UPDATE operations
        Matcher updateMatcher = UPDATE_PATTERN.matcher(cleanSql);
        while (updateMatcher.find()) {
            String tableName = updateMatcher.group(1).toUpperCase();
            addOperation(tableOperations, tableName, "U");
        }
        
        // Find all DELETE operations
        Matcher deleteMatcher = DELETE_PATTERN.matcher(cleanSql);
        while (deleteMatcher.find()) {
            String tableName = deleteMatcher.group(1).toUpperCase();
            addOperation(tableOperations, tableName, "D");
        }
        
        // Find all SELECT operations (excluding "SELECT 1")
        analyzeSelectOperations(cleanSql, tableOperations);
    }

    private void analyzeSelectOperations(String sql, Map<String, Map<String, String>> tableOperations) {
        // Pattern to match SELECT statements
        Pattern selectWithColumnsPattern = Pattern.compile(
                "select\\s+(?!1\\s+from)(.+?)\\s+from\\s+(\\w+)(?:\\s+(\\w+))?",
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL
        );
        
        Matcher selectMatcher = selectWithColumnsPattern.matcher(sql);
        
        while (selectMatcher.find()) {
            String columns = selectMatcher.group(1).trim();
            String tableName = selectMatcher.group(2).toUpperCase();
            String alias = selectMatcher.group(3);
            
            // Check if this is actually selecting columns from the table
            if (isSelectingColumnsFromTable(columns, tableName, alias)) {
                addOperation(tableOperations, tableName, "R");
            }
        }
        
        // Also check for JOIN clauses to find tables being read
        Matcher joinMatcher = Pattern.compile(
                "join\\s+(\\w+)(?:\\s+(\\w+))?\\s+on",
                Pattern.CASE_INSENSITIVE
        ).matcher(sql);
        
        while (joinMatcher.find()) {
            String tableName = joinMatcher.group(1).toUpperCase();
            // Only add R if the table is actually used (has columns referenced)
            if (tableReferencedInJoin(sql, tableName, joinMatcher.group(2))) {
                addOperation(tableOperations, tableName, "R");
            }
        }
    }

    private boolean isSelectingColumnsFromTable(String columns, String tableName, String alias) {
        // If selecting "1", it's not reading actual columns
        if (columns.trim().equals("1")) {
            return false;
        }
        
        // If columns contain actual column names (not just "1")
        // and they reference the table/alias, mark as R
        String tablePrefix = alias != null ? alias.toLowerCase() : tableName.toLowerCase();
        String columnsLower = columns.toLowerCase();
        
        // Check if columns reference the table/alias
        // or if columns are not just "1"
        if (columnsLower.contains(tablePrefix + ".") || 
            (!columnsLower.trim().equals("1") && !columnsLower.contains("select 1"))) {
            return true;
        }
        
        return false;
    }

    private boolean tableReferencedInJoin(String sql, String tableName, String alias) {
        String reference = alias != null ? alias : tableName;
        Pattern referencePattern = Pattern.compile(
                "\\b" + reference + "\\.(\\w+)",
                Pattern.CASE_INSENSITIVE
        );
        
        return referencePattern.matcher(sql).find();
    }

    private String cleanSql(String sql) {
        // Remove comments
        sql = sql.replaceAll("--[^\n]*", " ");
        sql = sql.replaceAll("/\\*.*?\\*/", " ");
        
        // Remove extra whitespace
        sql = sql.replaceAll("\\s+", " ");
        
        return sql.trim();
    }

    private void addOperation(Map<String, Map<String, String>> tableOperations, String tableName, String operation) {
        tableOperations.putIfAbsent(tableName, new LinkedHashMap<>());
        Map<String, String> ops = tableOperations.get(tableName);
        
        // Add operation if not already present
        String currentOps = ops.getOrDefault(tableName, "");
        if (!currentOps.contains(operation)) {
            ops.put(tableName, currentOps + operation);
        }
    }
}
