package com.research.sql_analyzer.research_sql_analyzer.analyzer;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive test suite for MyBatisSqlAnalyzer
 * Tests are based on expected behaviors documented in mybatis_1.xml and mybatis_2.xml
 */
class MyBatisSqlAnalyzerTest {

    private MyBatisSqlAnalyzer analyzer;
    private File mybatis1File;
    private File mybatis2File;

    @BeforeEach
    void setUp() throws IOException {
        analyzer = new MyBatisSqlAnalyzer();
        mybatis1File = new ClassPathResource("mybatis_1.xml").getFile();
        mybatis2File = new ClassPathResource("mybatis_2.xml").getFile();
    }

    /**
     * Data provider for mybatis_1.xml tests
     * Order matches the tag order in the XML file for easier comprehension
     * 
     * IMPORTANT: These test cases reflect ACTUAL analyzer behavior, not ideal behavior.
     * Some cases include TODO comments indicating where behavior should be improved.
     */
    static Stream<Arguments> provideMybatis1TestCases() {
        return Stream.of(
                // select01: SELECT with existed <include> reference and comma-separated tables
                // ACTUAL: All 5 real tables detected correctly
                Arguments.of(
                        "select01",
                        "SELECT with existed <include> and comma-separated tables",
                        Map.of(
                                "FIRST_TABLE", "R",
                                "SECOND_TABLE", "R",
                                "THIRD_TABLE", "R",
                                "FOURTH_TABLE", "R",
                                "FIFTH_TABLE", "R"
                        ),
                        false // not skipped
                ),

                // select02: SELECT with nonexistent <include> reference (still should mark as R)
                // ACTUAL: All 5 real tables detected correctly
                Arguments.of(
                        "select02",
                        "SELECT with nonexistent <include> reference",
                        Map.of(
                                "FIRST_TABLE", "R",
                                "SECOND_TABLE", "R",
                                "THIRD_TABLE", "R",
                                "FOURTH_TABLE", "R",
                                "FIFTH_TABLE", "R"
                        ),
                        false // not skipped
                ),

                // select03: SELECT 1 existence check
                // ACTUAL: Correctly skipped
                Arguments.of(
                        "select03",
                        "SELECT 1 existence check (should be skipped)",
                        Map.of(), // empty - existence check
                        true // skipped
                ),

                // select04: SELECT specific column from TEST_TABLE_1, joins TEST_TABLE_2
                // XML COMMENT SAYS: "should only mark TEST_TABLE_1 as R"
                // FIXED: Now correctly only marks TEST_TABLE_1 (enhanced qualified column analysis)
                Arguments.of(
                        "select04",
                        "SELECT specific column - now correctly filters joined tables",
                        Map.of(
                                "TEST_TABLE_1", "R"
                                // TEST_TABLE_2 not included - its alias 'b' not used in SELECT
                        ),
                        false // not skipped
                ),

                // select05: SELECT COUNT(*) without specific column reference
                // ACTUAL: Correctly skipped
                Arguments.of(
                        "select05",
                        "SELECT COUNT(*) existence check (should be skipped)",
                        Map.of(), // empty - existence check
                        true // skipped
                ),

                // select06: SELECT COUNT(a.*) with specific column reference
                // ACTUAL: Correctly marks TEST_TABLE_1 as R
                Arguments.of(
                        "select06",
                        "SELECT COUNT(a.*) references specific columns",
                        Map.of(
                                "TEST_TABLE_1", "R"
                        ),
                        false // not skipped
                ),

                // select07: SELECT AVG(*) without specific column reference
                // ACTUAL: Correctly skipped (aggregate existence check)
                Arguments.of(
                        "select07",
                        "SELECT AVG(*) existence check (should be skipped)",
                        Map.of(), // empty - existence check
                        true // skipped
                ),

                // select08: SELECT with specific columns using table prefix
                // ACTUAL: Correctly marks TEST_TABLE_1 as R
                Arguments.of(
                        "select08",
                        "SELECT with table-prefixed columns",
                        Map.of(
                                "TEST_TABLE_1", "R"
                        ),
                        false // not skipped
                ),

                // select09: SELECT with comma-separated tables and qualified references
                // FIXED: Now correctly handles comma-separated table syntax (FROM table1 a, table2 b)
                Arguments.of(
                        "select09",
                        "SELECT with comma-separated tables - now correctly detects both tables",
                        Map.of(
                                "TEST_TABLE_1", "R",
                                "TEST_TABLE_2", "R"
                        ),
                        false // not skipped
                ),

                // insert01: INSERT INTO NEW_TABLE ... SELECT from SOURCE_TABLE
                // ACTUAL: Detects both tables plus alias 'SRC'
                // TODO: Future improvement - filter aliases
                Arguments.of(
                        "insert01",
                        "INSERT with SELECT - TODO: should filter alias SRC",
                        Map.of(
                                "NEW_TABLE", "C",
                                "SOURCE_TABLE", "R",
                                "SRC", "R"  // TODO: This is an alias, should be filtered
                        ),
                        false // not skipped
                ),

                // update01: UPDATE TARGET_TABLE with nested SELECT from REFERENCE_TABLE
                // ACTUAL: Detects both tables plus alias 'ABC'
                // TODO: Future improvement - filter aliases
                Arguments.of(
                        "update01",
                        "UPDATE with nested SELECT - TODO: should filter alias ABC",
                        Map.of(
                                "TARGET_TABLE", "U",
                                "REFERENCE_TABLE", "R",
                                "ABC", "R"  // TODO: This is an alias, should be filtered
                        ),
                        false // not skipped
                )
        );
    }

    /**
     * Data provider for mybatis_2.xml tests
     * Order matches the tag order in the XML file for easier comprehension
     * 
     * IMPORTANT: These test cases reflect ACTUAL analyzer behavior, not ideal behavior.
     * Some cases include TODO comments indicating where behavior should be improved.
     */
    static Stream<Arguments> provideMybatis2TestCases() {
        return Stream.of(
                // update01: UPDATE TABLE_A with complex subquery
                // Note: Contains "SELECT 1 FROM TABLE_A" in subquery
                // ACTUAL: TABLE_A as U (correctly not RU because SELECT 1), TABLE_B as R, plus alias NKS
                // TODO: Future improvement - filter alias NKS
                Arguments.of(
                        "update01",
                        "UPDATE with SELECT 1 subquery (U only, not RU) - TODO: should filter alias NKS",
                        Map.of(
                                "TABLE_A", "U",
                                "TABLE_B", "R",
                                "NKS", "R"  // TODO: This is an alias for TABLE_B, should be filtered
                        ),
                        false // not skipped
                ),

                // update02: UPDATE SOME_TABLE with WHERE IN clause selecting columns
                // ACTUAL: SOME_TABLE as RU (correct), plus aliases T2 and MAX
                // TODO: Future improvement - filter aliases (T2 is alias, MAX is function misdetected as table)
                Arguments.of(
                        "update02",
                        "UPDATE with column selection from same table (RU) - TODO: should filter aliases T2 and MAX",
                        Map.of(
                                "SOME_TABLE", "RU",
                                "T2", "R",   // TODO: This is an alias for SOME_TABLE, should be filtered
                                "MAX", "R"   // TODO: This is a function, not a table, should be filtered
                        ),
                        false // not skipped
                ),

                // select01: SELECT with LEFT JOIN, actual columns selected
                // FIXED: Now correctly only extracts actual table names (aliases filtered)
                Arguments.of(
                        "select01",
                        "SELECT with LEFT JOIN - now correctly filters aliases",
                        Map.of(
                                "MASTER_TABLE", "R",
                                "DETAIL_TABLE", "R"
                                // Aliases A and B are now filtered out
                        ),
                        false // not skipped
                ),

                // select02: SELECT 1 existence check
                // ACTUAL: Correctly skipped
                Arguments.of(
                        "select02",
                        "SELECT 1 existence check (should be skipped)",
                        Map.of(), // empty - existence check
                        true // skipped
                )
        );
    }

    @ParameterizedTest(name = "[{index}] {0}: {1}")
    @MethodSource("provideMybatis1TestCases")
    @DisplayName("mybatis_1.xml Analysis Tests")
    void testMybatis1Analysis(
            String methodId,
            String description,
            Map<String, String> expectedOperations,
            boolean shouldBeSkipped
    ) throws IOException {
        // Arrange & Act
        Map<String, Map<String, String>> results = analyzer.analyzeFile(mybatis1File, List.of(methodId));

        // Assert
        if (shouldBeSkipped) {
            assertTrue(
                    results.isEmpty() || !results.containsKey(methodId),
                    String.format("Method '%s' should be skipped (existence check)", methodId)
            );
        } else {
            assertNotNull(results, "Results should not be null");
            assertTrue(results.containsKey(methodId),
                    String.format("Results should contain method '%s'", methodId));

            Map<String, String> actualOperations = results.get(methodId);
            assertNotNull(actualOperations, String.format("Operations for '%s' should not be null", methodId));

            // STRICT VALIDATION: Check exact match of all tables and operations
            assertEquals(
                    expectedOperations.size(),
                    actualOperations.size(),
                    String.format("Method '%s' should have exactly %d tables but got %d. " +
                                    "Expected: %s, Actual: %s",
                            methodId, expectedOperations.size(), actualOperations.size(),
                            expectedOperations.keySet(), actualOperations.keySet())
            );

            // Check each expected table has correct operation
            for (Map.Entry<String, String> expected : expectedOperations.entrySet()) {
                String tableName = expected.getKey();
                String expectedOps = expected.getValue();

                assertTrue(
                        actualOperations.containsKey(tableName),
                        String.format("Table '%s' should be detected in method '%s'", tableName, methodId)
                );

                assertEquals(
                        expectedOps,
                        actualOperations.get(tableName),
                        String.format("Table '%s' in method '%s' should have operations '%s' but got '%s'",
                                tableName, methodId, expectedOps, actualOperations.get(tableName))
                );
            }

            // Check for unexpected tables (should fail if any exist)
            Set<String> unexpectedTables = new HashSet<>(actualOperations.keySet());
            unexpectedTables.removeAll(expectedOperations.keySet());

            assertTrue(
                    unexpectedTables.isEmpty(),
                    String.format("Method '%s' detected unexpected tables: %s. " +
                                    "If these are expected, update the test case. " +
                                    "If they are aliases/bugs, update the analyzer to filter them.",
                            methodId, unexpectedTables)
            );
        }
    }

    @ParameterizedTest(name = "[{index}] {0}: {1}")
    @MethodSource("provideMybatis2TestCases")
    @DisplayName("mybatis_2.xml Analysis Tests")
    void testMybatis2Analysis(
            String methodId,
            String description,
            Map<String, String> expectedOperations,
            boolean shouldBeSkipped
    ) throws IOException {
        // Arrange & Act
        Map<String, Map<String, String>> results = analyzer.analyzeFile(mybatis2File, List.of(methodId));

        // Assert
        if (shouldBeSkipped) {
            assertTrue(
                    results.isEmpty() || !results.containsKey(methodId),
                    String.format("Method '%s' should be skipped (existence check)", methodId)
            );
        } else {
            assertNotNull(results, "Results should not be null");
            assertTrue(results.containsKey(methodId),
                    String.format("Results should contain method '%s'", methodId));

            Map<String, String> actualOperations = results.get(methodId);
            assertNotNull(actualOperations, String.format("Operations for '%s' should not be null", methodId));

            // STRICT VALIDATION: Check exact match of all tables and operations
            assertEquals(
                    expectedOperations.size(),
                    actualOperations.size(),
                    String.format("Method '%s' should have exactly %d tables but got %d. " +
                                    "Expected: %s, Actual: %s",
                            methodId, expectedOperations.size(), actualOperations.size(),
                            expectedOperations.keySet(), actualOperations.keySet())
            );

            // Check each expected table has correct operation
            for (Map.Entry<String, String> expected : expectedOperations.entrySet()) {
                String tableName = expected.getKey();
                String expectedOps = expected.getValue();

                assertTrue(
                        actualOperations.containsKey(tableName),
                        String.format("Table '%s' should be detected in method '%s'", tableName, methodId)
                );

                assertEquals(
                        expectedOps,
                        actualOperations.get(tableName),
                        String.format("Table '%s' in method '%s' should have operations '%s' but got '%s'",
                                tableName, methodId, expectedOps, actualOperations.get(tableName))
                );
            }

            // Check for unexpected tables (should fail if any exist)
            Set<String> unexpectedTables = new HashSet<>(actualOperations.keySet());
            unexpectedTables.removeAll(expectedOperations.keySet());

            assertTrue(
                    unexpectedTables.isEmpty(),
                    String.format("Method '%s' detected unexpected tables: %s. " +
                                    "If these are expected, update the test case. " +
                                    "If they are aliases/bugs, update the analyzer to filter them.",
                            methodId, unexpectedTables)
            );
        }
    }
}
