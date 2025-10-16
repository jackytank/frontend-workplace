package com.research.sql_analyzer.research_sql_analyzer.analyzer;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Component
public class MyBatisSqlAnalyzer {

    // Pattern to detect existence checks (SELECT 1, SELECT 'X', SELECT COUNT(*))
    // Pattern to detect existence checks or aggregate queries without qualified column references
    // Matches: SELECT 1, SELECT COUNT(*), SELECT AVG(*), SELECT SUM(*), etc.
    // Note: Intentionally excludes SELECT 'X' pattern as it's Oracle-specific and not universally understood
    private static final Pattern EXISTENCE_CHECK_PATTERN = Pattern.compile(
            "^\\s*SELECT\\s+(?:1|(?:COUNT|AVG|SUM|MIN|MAX)\\s*\\(\\s*\\*\\s*\\))\\s+FROM\\s+",
            Pattern.CASE_INSENSITIVE);

    // Pattern to extract table names from SQL statements
    private static final Pattern TABLE_EXTRACTION_PATTERN = Pattern.compile(
            "(?:FROM|JOIN|UPDATE|INTO|DELETE\\s+FROM)\\s+([A-Z_][A-Z0-9_]*)(?:\\s+(?:AS\\s+)?[A-Z_][A-Z0-9_]*)?",
            Pattern.CASE_INSENSITIVE);

    // Pattern for comma-separated tables in FROM clause
    private static final Pattern COMMA_TABLE_PATTERN = Pattern.compile(
            ",\\s*([A-Z_][A-Z0-9_]*)(?:\\s+(?:AS\\s+)?[A-Z_][A-Z0-9_]*)?",
            Pattern.CASE_INSENSITIVE);

    // Pattern to find nested SELECT statements
    private static final Pattern NESTED_SELECT_PATTERN = Pattern.compile(
            "SELECT\\s+.+?\\s+FROM\\s+[A-Z_][A-Z0-9_,\\s]+",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    // Pattern for INSERT INTO
    private static final Pattern INSERT_PATTERN = Pattern.compile(
            "INSERT\\s+INTO\\s+([A-Z_][A-Z0-9_]*)",
            Pattern.CASE_INSENSITIVE);

    // Pattern for UPDATE table
    private static final Pattern UPDATE_PATTERN = Pattern.compile(
            "UPDATE\\s+([A-Z_][A-Z0-9_]*)(?:\\s+([A-Z_][A-Z0-9_]*))?",
            Pattern.CASE_INSENSITIVE);

    // Pattern for DELETE FROM
    private static final Pattern DELETE_PATTERN = Pattern.compile(
            "DELETE\\s+FROM\\s+([A-Z_][A-Z0-9_]*)",
            Pattern.CASE_INSENSITIVE);

    // Pattern to extract SELECT clause content (between SELECT and FROM)
    private static final Pattern SELECT_CLAUSE_PATTERN = Pattern.compile(
            "SELECT\\s+(.+?)\\s+FROM",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    // Pattern to extract table with alias (FROM/JOIN table [AS] alias)
    private static final Pattern TABLE_WITH_ALIAS_PATTERN = Pattern.compile(
            "(?:FROM|JOIN)\\s+([A-Z_][A-Z0-9_]*)(?:\\s+(?:AS\\s+)?([A-Z_][A-Z0-9_]*))?",
            Pattern.CASE_INSENSITIVE);

    // More flexible pattern for qualified column references (alias.column)
    private static final Pattern QUALIFIED_COLUMN_PATTERN = Pattern.compile(
            "\\b([a-z0-9_][a-z0-9_\\-\\.]*)\\.",
            Pattern.CASE_INSENSITIVE);

    // SQL keywords to exclude from table names
    private static final Set<String> SQL_KEYWORDS = Set.of(
            "SELECT", "FROM", "WHERE", "AND", "OR", "ON", "INNER", "LEFT", "RIGHT",
            "OUTER", "CROSS", "JOIN", "SET", "DUAL", "VALUES", "VALUE", "AS", "IN", "EXISTS");

    /**
     * Analyze a MyBatis XML file for specific method IDs
     */
    public Map<String, Map<String, String>> analyzeFile(File xmlFile, List<String> methodsToFind) throws IOException {
        Map<String, Map<String, String>> results = new LinkedHashMap<>();

        try {
            Document doc = Jsoup.parse(xmlFile, "UTF-8");

            for (String methodId : methodsToFind) {
                log.debug("Looking for method: {}", methodId);

                // Find SQL elements (select, insert, update, delete) with matching id
                Elements sqlElements = doc.select(String.format(
                        "select[id=%s], insert[id=%s], update[id=%s], delete[id=%s]",
                        methodId, methodId, methodId, methodId));

                if (sqlElements.isEmpty()) {
                    log.warn("Method '{}' not found in {}", methodId, xmlFile.getName());
                    continue;
                }

                Element sqlElement = sqlElements.first();
                String sqlText = extractSqlText(sqlElement, doc);

                log.debug("Analyzing SQL for method '{}': {}", methodId,
                        sqlText.substring(0, Math.min(100, sqlText.length())));

                Map<String, String> tableOperations = analyzeSqlStatement(sqlText, sqlElement.tagName());

                if (!tableOperations.isEmpty()) {
                    results.put(methodId, tableOperations);
                }
            }

        } catch (Exception e) {
            log.error("Error analyzing file: {}", xmlFile.getName(), e);
            throw new IOException("Failed to analyze MyBatis XML file", e);
        }

        return results;
    }

    /**
     * Extract SQL text from element, resolving <include> references
     */
    private String extractSqlText(Element sqlElement, Document doc) {
        // Get the raw text content (this handles CDATA automatically)
        String rawText = sqlElement.text();

        // Check for <set> tag and add SET keyword if missing
        Elements setElements = sqlElement.select("set");
        if (!setElements.isEmpty()) {
            // JSoup removes the <set> tag but keeps content
            // We need to add back the SET keyword
            String setContent = setElements.first().text();
            if (rawText.contains(setContent) && !rawText.toUpperCase().contains("SET")) {
                rawText = rawText.replace(setContent, " SET " + setContent);
            }
        }

        // Check for <include> elements and resolve them
        Elements includes = sqlElement.select("include");
        String sqlText = rawText;

        for (Element include : includes) {
            String refId = include.attr("refid");
            Element sqlFragment = doc.selectFirst(String.format("sql[id=%s]", refId));
            if (sqlFragment != null) {
                // Replace the include placeholder with actual columns
                sqlText = sqlText.replace(include.text(), sqlFragment.text());
            } else {
                // Include not found - mark as column selection with placeholder
                sqlText = sqlText.replace(include.text(), " COL1, COL2, COL3 ");
            }
        }

        return cleanSql(sqlText);
    }

    /**
     * Clean SQL text by removing MyBatis syntax and normalizing
     */
    private String cleanSql(String sql) {
        // Remove MyBatis parameter syntax like #{param} and ${param}
        sql = sql.replaceAll("#\\{[^}]+\\}", "'VALUE'");
        sql = sql.replaceAll("\\$\\{[^}]+\\}", "'VALUE'");

        // Remove SQL comments (-- style)
        sql = sql.replaceAll("--[^\\n]*", "");

        // Normalize whitespace
        sql = sql.replaceAll("\\s+", " ").trim();

        return sql;
    }

    /**
     * Analyze SQL statement and determine CRUD operations using regex patterns
     */
    private Map<String, String> analyzeSqlStatement(String sql, String tagName) {
        Map<String, Set<String>> tableOperations = new LinkedHashMap<>();

        // Determine operation type based on SQL statement type
        String upperSql = sql.toUpperCase().trim();

        if (upperSql.startsWith("SELECT")) {
            analyzeSelectStatement(sql, tableOperations);
        } else if (upperSql.startsWith("INSERT")) {
            analyzeInsertStatement(sql, tableOperations);
        } else if (upperSql.startsWith("UPDATE")) {
            analyzeUpdateStatement(sql, tableOperations);
        } else if (upperSql.startsWith("DELETE")) {
            analyzeDeleteStatement(sql, tableOperations);
        } else {
            // Fallback based on tag name
            log.debug("Unknown SQL type, using tag name: {}", tagName);
            analyzeByTagName(sql, tagName, tableOperations);
        }

        // Convert Set<String> to concatenated String (e.g., "CR", "RU")
        return convertToResult(tableOperations);
    }

    /**
     * Analyze SELECT statement using regex patterns
     * Enhanced to handle qualified column references for accurate Read detection
     */
    private void analyzeSelectStatement(String sql, Map<String, Set<String>> tableOperations) {
        // Check if it's an existence check (SELECT 1, SELECT COUNT(*), etc.)
        if (isExistenceCheck(sql)) {
            log.debug("Detected existence check, skipping table marking: {}",
                    sql.substring(0, Math.min(50, sql.length())));
            return;
        }

        // Try smart analysis if SELECT has qualified columns (e.g., a.column_name)
        if (hasQualifiedColumns(sql)) {
            boolean success = analyzeQualifiedSelect(sql, tableOperations);
            if (success) {
                log.debug("Smart qualified column analysis successful");
                // Note: Don't call analyzeNestedSelects() here because NESTED_SELECT_PATTERN
                // will match the main SELECT itself, causing duplicate table extraction
                // Only analyze actual subqueries in WHERE/IN/EXISTS clauses
                return;
            }
        }

        // Fallback: Conservative marking (current behavior)
        log.debug("Using conservative table marking (SELECT * or unqualified columns)");
        extractTablesFromSql(sql, tableOperations, "R");

        // Analyze nested SELECT statements (subqueries)
        analyzeNestedSelects(sql, tableOperations);
    }

    /**
     * Analyze INSERT statement using regex patterns
     */
    private void analyzeInsertStatement(String sql, Map<String, Set<String>> tableOperations) {
        // Extract table name after INSERT INTO
        Matcher matcher = INSERT_PATTERN.matcher(sql);
        if (matcher.find()) {
            String tableName = matcher.group(1);
            if (!isSqlKeyword(tableName)) {
                tableOperations.computeIfAbsent(tableName, k -> new LinkedHashSet<>()).add("C");
            }
        }

        // Check for INSERT ... SELECT pattern
        if (sql.toUpperCase().contains("SELECT")) {
            int selectPos = sql.toUpperCase().indexOf("SELECT");
            String selectPart = sql.substring(selectPos);

            if (!isExistenceCheck(selectPart)) {
                extractTablesFromSql(selectPart, tableOperations, "R");
            }
        }
    }

    /**
     * Analyze UPDATE statement using regex patterns
     */
    private void analyzeUpdateStatement(String sql, Map<String, Set<String>> tableOperations) {
        // Extract table name after UPDATE
        Matcher matcher = UPDATE_PATTERN.matcher(sql);
        if (matcher.find()) {
            String tableName = matcher.group(1);
            if (!isSqlKeyword(tableName)) {
                tableOperations.computeIfAbsent(tableName, k -> new LinkedHashSet<>()).add("U");
            }
        }

        // Check for nested SELECT statements in WHERE clause or subqueries
        if (sql.toUpperCase().contains("SELECT")) {
            analyzeNestedSelects(sql, tableOperations);
        }
    }

    /**
     * Analyze DELETE statement using regex patterns
     */
    private void analyzeDeleteStatement(String sql, Map<String, Set<String>> tableOperations) {
        // Extract table name after DELETE FROM
        Matcher matcher = DELETE_PATTERN.matcher(sql);
        if (matcher.find()) {
            String tableName = matcher.group(1);
            if (!isSqlKeyword(tableName)) {
                tableOperations.computeIfAbsent(tableName, k -> new LinkedHashSet<>()).add("D");
            }
        }

        // Check for nested SELECT statements in WHERE clause
        if (sql.toUpperCase().contains("SELECT")) {
            analyzeNestedSelects(sql, tableOperations);
        }
    }

    /**
     * Check if SELECT is an existence check (SELECT 1, SELECT 'X', SELECT COUNT(*))
     */
    private boolean isExistenceCheck(String sql) {
        String trimmed = sql.trim();
        return EXISTENCE_CHECK_PATTERN.matcher(trimmed).find();
    }

    /**
     * Extract tables from SQL using regex patterns
     */
    private void extractTablesFromSql(String sql, Map<String, Set<String>> tableOperations, String operation) {
        // Extract tables from FROM and JOIN clauses
        Matcher tableMatcher = TABLE_EXTRACTION_PATTERN.matcher(sql);
        while (tableMatcher.find()) {
            String tableName = tableMatcher.group(1);
            if (!isSqlKeyword(tableName)) {
                tableOperations.computeIfAbsent(tableName, k -> new LinkedHashSet<>()).add(operation);
            }
        }

        // Handle comma-separated tables in FROM clause (e.g., FROM table1 A, table2 B,
        // table3)
        if (sql.contains(",")) {
            Matcher commaMatcher = COMMA_TABLE_PATTERN.matcher(sql);
            while (commaMatcher.find()) {
                String tableName = commaMatcher.group(1);
                if (!isSqlKeyword(tableName)) {
                    tableOperations.computeIfAbsent(tableName, k -> new LinkedHashSet<>()).add(operation);
                }
            }
        }
    }

    /**
     * Analyze nested SELECT statements within a SQL query
     */
    private void analyzeNestedSelects(String sql, Map<String, Set<String>> tableOperations) {
        Matcher selectMatcher = NESTED_SELECT_PATTERN.matcher(sql);

        while (selectMatcher.find()) {
            String selectSql = selectMatcher.group();
            log.debug("Found nested SELECT: {}", selectSql.substring(0, Math.min(60, selectSql.length())));

            // Skip if it's an existence check
            if (isExistenceCheck(selectSql)) {
                log.debug("Skipping nested SELECT (existence check)");
                continue;
            }

            // Extract tables from the nested SELECT
            log.debug("Extracting tables from nested SELECT");
            extractTablesFromSql(selectSql, tableOperations, "R");
        }
    }

    /**
     * Check if a string is a SQL keyword
     */
    private boolean isSqlKeyword(String word) {
        return SQL_KEYWORDS.contains(word.toUpperCase());
    }

    /**
     * Check if SELECT clause has qualified column references (alias.column or table.column)
     */
    private boolean hasQualifiedColumns(String sql) {
        String selectClause = extractSelectClause(sql);
        if (selectClause == null || selectClause.trim().equals("*")) {
            return false;
        }

        // Look for qualified column references (identifier.identifier)
        Matcher matcher = QUALIFIED_COLUMN_PATTERN.matcher(selectClause);
        while (matcher.find()) {
            String qualifier = matcher.group(1);
            // Make sure it's not a SQL keyword
            if (!isSqlKeyword(qualifier)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Extract SELECT clause content (between SELECT and FROM)
     */
    private String extractSelectClause(String sql) {
        Matcher matcher = SELECT_CLAUSE_PATTERN.matcher(sql);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    /**
     * Analyze SELECT with qualified columns (e.g., a.column_name)
     * Only marks tables whose aliases are actually referenced in SELECT clause
     * 
     * @return true if analysis was successful, false if should fall back to conservative
     */
    private boolean analyzeQualifiedSelect(String sql, Map<String, Set<String>> tableOperations) {
        try {
            log.debug("=== Analyzing qualified SELECT ===");
            log.debug("SQL: {}", sql.substring(0, Math.min(100, sql.length())));
            
            // Step 1: Extract table-to-alias mappings
            Map<String, String> aliasToTable = extractTableAliasMapping(sql);
            if (aliasToTable.isEmpty()) {
                log.debug("No aliases found, falling back");
                return false; // No aliases found, fall back
            }
            log.debug("Alias mappings: {}", aliasToTable);

            // Step 2: Find which aliases are referenced in SELECT clause
            Set<String> referencedAliases = extractReferencedAliases(sql);
            if (referencedAliases.isEmpty()) {
                log.debug("No qualified references found, falling back");
                return false; // No qualified references found, fall back
            }
            log.debug("Referenced aliases: {}", referencedAliases);

            // Step 3: Only mark tables whose aliases are used
            for (String alias : referencedAliases) {
                String tableName = aliasToTable.get(alias.toLowerCase());
                if (tableName != null && !isSqlKeyword(tableName)) {
                    tableOperations.computeIfAbsent(tableName, k -> new LinkedHashSet<>()).add("R");
                    log.debug("Marked table '{}' as R (via alias '{}')", tableName, alias);
                } else {
                    log.debug("Alias '{}' not found in mapping", alias);
                }
            }

            log.debug("=== Qualified SELECT analysis successful ===");
            return true; // Success
        } catch (Exception e) {
            log.warn("Error in qualified select analysis, falling back: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Extract table-to-alias mapping from FROM and JOIN clauses
     * Returns map of: alias (lowercase) → table name
     * Handles both JOIN syntax and comma-separated tables
     */
    private Map<String, String> extractTableAliasMapping(String sql) {
        Map<String, String> aliasToTable = new HashMap<>();

        // Handle FROM/JOIN syntax (e.g., FROM table1 a JOIN table2 b)
        Matcher matcher = TABLE_WITH_ALIAS_PATTERN.matcher(sql);
        while (matcher.find()) {
            String tableName = matcher.group(1);
            String alias = matcher.group(2);

            if (!isSqlKeyword(tableName)) {
                if (alias != null && !alias.isEmpty() && !isSqlKeyword(alias)) {
                    // Map alias to table name (use lowercase for case-insensitive matching)
                    aliasToTable.put(alias.toLowerCase(), tableName);
                    log.debug("Mapped alias '{}' → table '{}'", alias, tableName);
                } else {
                    // No alias, use table name as its own alias
                    aliasToTable.put(tableName.toLowerCase(), tableName);
                }
            }
        }

        // Handle comma-separated tables (e.g., FROM table1 a, table2 b, table3 c)
        // Extract the FROM clause content first
        Pattern fromClausePattern = Pattern.compile(
                "FROM\\s+(.+?)(?:WHERE|GROUP|HAVING|ORDER|LIMIT|$)",
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
        Matcher fromMatcher = fromClausePattern.matcher(sql);
        
        if (fromMatcher.find()) {
            String fromClause = fromMatcher.group(1).trim();
            
            // Pattern to match table with optional alias in comma-separated list
            // Matches: table_name [alias],
            Pattern commaTablePattern = Pattern.compile(
                    "([A-Z_][A-Z0-9_]*)(?:\\s+(?:AS\\s+)?([A-Z_][A-Z0-9_]*))?(?:\\s*,|\\s*$)",
                    Pattern.CASE_INSENSITIVE);
            
            Matcher commaMatcher = commaTablePattern.matcher(fromClause);
            while (commaMatcher.find()) {
                String tableName = commaMatcher.group(1);
                String alias = commaMatcher.group(2);
                
                if (!isSqlKeyword(tableName)) {
                    if (alias != null && !alias.isEmpty() && !isSqlKeyword(alias)) {
                        // Only add if not already present (FROM/JOIN has priority)
                        aliasToTable.putIfAbsent(alias.toLowerCase(), tableName);
                        log.debug("Mapped comma-separated alias '{}' → table '{}'", alias, tableName);
                    } else {
                        aliasToTable.putIfAbsent(tableName.toLowerCase(), tableName);
                    }
                }
            }
        }

        return aliasToTable;
    }

    /**
     * Find which aliases/qualifiers are referenced in SELECT clause
     * Returns set of aliases (lowercase) that appear before a dot (qualifier.column)
     */
    private Set<String> extractReferencedAliases(String sql) {
        Set<String> aliases = new HashSet<>();
        String selectClause = extractSelectClause(sql);

        if (selectClause != null) {
            Matcher matcher = QUALIFIED_COLUMN_PATTERN.matcher(selectClause);
            while (matcher.find()) {
                String qualifier = matcher.group(1);
                if (!isSqlKeyword(qualifier)) {
                    aliases.add(qualifier.toLowerCase());
                    log.debug("Found referenced alias/qualifier: '{}'", qualifier);
                }
            }
        }

        return aliases;
    }

    /**
     * Fallback analysis based on tag name
     */
    private void analyzeByTagName(String sql, String tagName, Map<String, Set<String>> tableOperations) {
        // Determine operation based on tag name
        switch (tagName.toLowerCase()) {
            case "select" -> {
                if (!isExistenceCheck(sql)) {
                    extractTablesFromSql(sql, tableOperations, "R");
                }
            }
            case "insert" -> analyzeInsertStatement(sql, tableOperations);
            case "update" -> analyzeUpdateStatement(sql, tableOperations);
            case "delete" -> analyzeDeleteStatement(sql, tableOperations);
            default -> {
                log.warn("Unknown tag name: {}", tagName);
                extractTablesFromSql(sql, tableOperations, "R");
            }
        }
    }

    /**
     * Convert Map<String, Set<String>> to Map<String, String> with concatenated
     * operations
     */
    private Map<String, String> convertToResult(Map<String, Set<String>> tableOperations) {
        Map<String, String> result = new LinkedHashMap<>();

        for (Map.Entry<String, Set<String>> entry : tableOperations.entrySet()) {
            String tableName = entry.getKey();
            Set<String> operations = entry.getValue();

            // Order operations: C, R, U, D
            StringBuilder orderedOps = new StringBuilder();
            if (operations.contains("C"))
                orderedOps.append("C");
            if (operations.contains("R"))
                orderedOps.append("R");
            if (operations.contains("U"))
                orderedOps.append("U");
            if (operations.contains("D"))
                orderedOps.append("D");

            result.put(tableName, orderedOps.toString());
        }

        return result;
    }
}
