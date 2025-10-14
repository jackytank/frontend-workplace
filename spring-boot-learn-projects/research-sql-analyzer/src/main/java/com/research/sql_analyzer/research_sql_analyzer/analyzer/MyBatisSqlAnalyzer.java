package com.research.sql_analyzer.research_sql_analyzer.analyzer;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
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

    // Pattern to match table names in SQL statements
    private static final Pattern FROM_PATTERN = Pattern.compile(
            "\\bfrom\\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\\s+(?:as\\s+)?([a-zA-Z_][a-zA-Z0-9_]*))?",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern JOIN_PATTERN = Pattern.compile(
            "\\bjoin\\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\\s+(?:as\\s+)?([a-zA-Z_][a-zA-Z0-9_]*))?",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern UPDATE_PATTERN = Pattern.compile(
            "\\bupdate\\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\\s+(?:as\\s+)?([a-zA-Z_][a-zA-Z0-9_]*))?",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern INSERT_PATTERN = Pattern.compile(
            "\\binsert\\s+into\\s+([a-zA-Z_][a-zA-Z0-9_]*)",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern DELETE_PATTERN = Pattern.compile(
            "\\bdelete\\s+from\\s+([a-zA-Z_][a-zA-Z0-9_]*)",
            Pattern.CASE_INSENSITIVE);

    /**
     * Analyze a MyBatis XML file for specific method IDs
     */
    public Map<String, Map<String, String>> analyzeFile(File xmlFile, List<String> methodsToFind) throws IOException {
        Map<String, Map<String, String>> results = new LinkedHashMap<>();

        // IMPORTANT: Use XML parser instead of HTML parser to preserve <include> tags
        Document doc = Jsoup.parse(xmlFile, "UTF-8", "", Parser.xmlParser());

        // Cache all <sql> fragments for reference resolution
        Map<String, String> sqlFragments = extractSqlFragments(doc);

        for (String methodId : methodsToFind) {
            Map<String, String> tableOperations = analyzeMethod(doc, methodId, sqlFragments);
            if (!tableOperations.isEmpty()) {
                results.put(methodId, tableOperations);
            }
        }

        return results;
    }

    /**
     * Extract all <sql> fragments with their IDs
     */
    private Map<String, String> extractSqlFragments(Document doc) {
        Map<String, String> fragments = new HashMap<>();
        Elements sqlElements = doc.select("sql[id]");

        for (Element sqlElement : sqlElements) {
            String id = sqlElement.attr("id");
            String content = sqlElement.text();
            fragments.put(id, content);
        }

        return fragments;
    }

    /**
     * Analyze a specific method (select, insert, update, delete statement)
     */
    private Map<String, String> analyzeMethod(Document doc, String methodId, Map<String, String> sqlFragments) {
        Map<String, String> tableOperations = new LinkedHashMap<>();

        // Find the statement with the given ID
        Elements statements = doc.select(
                String.format("select[id=%s], insert[id=%s], update[id=%s], delete[id=%s]",
                        methodId, methodId, methodId, methodId));

        if (statements.isEmpty()) {
            log.warn("Method '{}' not found in XML", methodId);
            return tableOperations;
        }

        Element statement = statements.first();
        String statementType = statement.tagName();

        // Get the full SQL content including resolved includes
        String sqlContent = resolveSqlContent(statement, sqlFragments);

        // Analyze based on statement type
        switch (statementType.toLowerCase()) {
            case "select":
                analyzeSelect(sqlContent, tableOperations);
                break;
            case "insert":
                analyzeInsert(sqlContent, tableOperations);
                break;
            case "update":
                analyzeUpdate(sqlContent, tableOperations);
                break;
            case "delete":
                analyzeDelete(sqlContent, tableOperations);
                break;
        }

        return tableOperations;
    }

    /**
     * Resolve SQL content including <include> references
     */
    private String resolveSqlContent(Element statement, Map<String, String> sqlFragments) {
        StringBuilder fullSql = new StringBuilder();

        // Clone the element to avoid modifying the original
        Element cloned = statement.clone();

        // Find all <include> elements and replace them with text nodes containing the
        // fragment content
        Elements includes = cloned.select("include[refid]");

        for (Element include : includes) {
            String refId = include.attr("refid");
            String fragmentContent = sqlFragments.get(refId);

            if (fragmentContent != null) {
                // Replace the include element with a text node containing the fragment
                include.text(fragmentContent);
                include.unwrap(); // Remove the include tag but keep the text
            }
        }

        // Get the full text content
        fullSql.append(cloned.text());

        return fullSql.toString();
    }

    /**
     * Analyze SELECT statements
     */
    private void analyzeSelect(String sql, Map<String, String> tableOperations) {
        // Build table alias map
        Map<String, String> aliasToTable = buildAliasMap(sql);

        // Find all FROM and JOIN clauses
        Set<String> tablesInFrom = new HashSet<>();
        Matcher fromMatcher = FROM_PATTERN.matcher(sql);
        while (fromMatcher.find()) {
            String tableName = fromMatcher.group(1);
            String alias = fromMatcher.group(2);
            tablesInFrom.add(tableName);
            if (alias != null) {
                aliasToTable.put(alias, tableName);
            }
        }

        Matcher joinMatcher = JOIN_PATTERN.matcher(sql);
        while (joinMatcher.find()) {
            String tableName = joinMatcher.group(1);
            String alias = joinMatcher.group(2);
            tablesInFrom.add(tableName);
            if (alias != null) {
                aliasToTable.put(alias, tableName);
            }
        }

        // Check if tables are actually being read (not just "select 1")
        for (String table : tablesInFrom) {
            if (isTableActuallyRead(sql, table, aliasToTable)) {
                addOperation(tableOperations, table, "R");
            }
        }
    }

    /**
     * Check if a table is actually being read (not just "select 1")
     */
    private boolean isTableActuallyRead(String sql, String tableName, Map<String, String> aliasToTable) {
        // Get all possible aliases for this table
        Set<String> tableReferences = new HashSet<>();
        tableReferences.add(tableName);

        for (Map.Entry<String, String> entry : aliasToTable.entrySet()) {
            if (entry.getValue().equalsIgnoreCase(tableName)) {
                tableReferences.add(entry.getKey());
            }
        }

        // Strategy 1: Look for explicit column references with table/alias prefix
        // Pattern: alias.column_name or table_name.column_name
        for (String ref : tableReferences) {
            Pattern columnPattern = Pattern.compile(
                    "\\b" + Pattern.quote(ref.toLowerCase()) + "\\s*\\.\\s*([a-zA-Z_][a-zA-Z0-9_]*)",
                    Pattern.CASE_INSENSITIVE);
            Matcher matcher = columnPattern.matcher(sql);
            while (matcher.find()) {
                String potentialColumn = matcher.group(1).toLowerCase();
                // Skip common SQL keywords that might appear after table alias
                if (!isSqlKeyword(potentialColumn)) {
                    return true; // Found actual column reference
                }
            }
        }

        // Strategy 2: If no qualified columns found, check if SELECT clause has actual
        // column names
        // Extract the SELECT clause (from SELECT to FROM)
        Pattern selectPattern = Pattern.compile(
                "select\\s+(.*?)\\s+from",
                Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
        Matcher selectMatcher = selectPattern.matcher(sql);
        if (selectMatcher.find()) {
            String selectClause = selectMatcher.group(1).trim();

            // If it's just "1" or numeric literal, it's not reading actual data
            if (selectClause.matches("^\\d+$")) {
                return false;
            }

            // If it contains actual column names (identifiers), consider it a read
            // Column names typically match: COLUMN_NAME, columnName, column123, etc.
            Pattern columnNamePattern = Pattern.compile("\\b[a-zA-Z_][a-zA-Z0-9_]*\\b");
            Matcher columnMatcher = columnNamePattern.matcher(selectClause);

            while (columnMatcher.find()) {
                String token = columnMatcher.group().toLowerCase();
                // If we find a non-SQL-keyword identifier, it's likely a column name
                if (!isSqlKeyword(token) && !token.equals("distinct") && !token.equals("to_char")) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if a word is a common SQL keyword
     */
    private boolean isSqlKeyword(String word) {
        Set<String> keywords = Set.of("from", "where", "and", "or", "on", "join",
                "left", "right", "inner", "outer", "as", "in", "exists", "not");
        return keywords.contains(word.toLowerCase());
    }

    /**
     * Analyze INSERT statements
     */
    private void analyzeInsert(String sql, Map<String, String> tableOperations) {
        Matcher matcher = INSERT_PATTERN.matcher(sql);
        while (matcher.find()) {
            String tableName = matcher.group(1);
            addOperation(tableOperations, tableName, "C");
        }

        // Also check for SELECT in INSERT (may read from other tables)
        analyzeSelect(sql, tableOperations);
    }

    /**
     * Analyze UPDATE statements
     */
    private void analyzeUpdate(String sql, Map<String, String> tableOperations) {
        Set<String> updateTargets = new HashSet<>();
        Matcher matcher = UPDATE_PATTERN.matcher(sql);
        while (matcher.find()) {
            String tableName = matcher.group(1);
            updateTargets.add(tableName.toUpperCase());
            addOperation(tableOperations, tableName, "U");
        }

        // Check for subqueries (may read from other tables)
        // But exclude tables that are UPDATE targets from being marked as READ
        Map<String, String> subqueryOperations = new LinkedHashMap<>();
        analyzeSelect(sql, subqueryOperations);

        // Only add READ operations for tables that are NOT UPDATE targets
        for (Map.Entry<String, String> entry : subqueryOperations.entrySet()) {
            if (!updateTargets.contains(entry.getKey().toUpperCase())) {
                addOperation(tableOperations, entry.getKey(), entry.getValue());
            }
        }
    }

    /**
     * Analyze DELETE statements
     */
    private void analyzeDelete(String sql, Map<String, String> tableOperations) {
        Set<String> deleteTargets = new HashSet<>();
        Matcher matcher = DELETE_PATTERN.matcher(sql);
        while (matcher.find()) {
            String tableName = matcher.group(1);
            deleteTargets.add(tableName.toUpperCase());
            addOperation(tableOperations, tableName, "D");
        }

        // Check for subqueries (may read from other tables)
        // But exclude tables that are DELETE targets from being marked as READ
        Map<String, String> subqueryOperations = new LinkedHashMap<>();
        analyzeSelect(sql, subqueryOperations);

        // Only add READ operations for tables that are NOT DELETE targets
        for (Map.Entry<String, String> entry : subqueryOperations.entrySet()) {
            if (!deleteTargets.contains(entry.getKey().toUpperCase())) {
                addOperation(tableOperations, entry.getKey(), entry.getValue());
            }
        }
    }

    /**
     * Build a map of aliases to table names
     */
    private Map<String, String> buildAliasMap(String sql) {
        Map<String, String> aliasMap = new HashMap<>();

        // FROM clauses
        Matcher fromMatcher = FROM_PATTERN.matcher(sql);
        while (fromMatcher.find()) {
            String tableName = fromMatcher.group(1);
            String alias = fromMatcher.group(2);
            if (alias != null) {
                aliasMap.put(alias, tableName);
            }
        }

        // JOIN clauses
        Matcher joinMatcher = JOIN_PATTERN.matcher(sql);
        while (joinMatcher.find()) {
            String tableName = joinMatcher.group(1);
            String alias = joinMatcher.group(2);
            if (alias != null) {
                aliasMap.put(alias, tableName);
            }
        }

        return aliasMap;
    }

    /**
     * Add an operation to a table, combining with existing operations
     */
    private void addOperation(Map<String, String> tableOperations, String tableName, String operation) {
        String existing = tableOperations.getOrDefault(tableName, "");

        // Build CRUD string in order
        Set<Character> ops = new TreeSet<>();
        for (char c : existing.toCharArray()) {
            ops.add(c);
        }
        for (char c : operation.toCharArray()) {
            ops.add(c);
        }

        // Order: C, R, U, D
        StringBuilder result = new StringBuilder();
        if (ops.contains('C'))
            result.append('C');
        if (ops.contains('R'))
            result.append('R');
        if (ops.contains('U'))
            result.append('U');
        if (ops.contains('D'))
            result.append('D');

        tableOperations.put(tableName, result.toString());
    }
}
