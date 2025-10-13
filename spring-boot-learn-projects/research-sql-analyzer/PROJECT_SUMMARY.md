# CRUD Analyzer - Project Summary

## Overview
A Spring Boot command-line application that analyzes MyBatis XML mapper files to intelligently detect CRUD operations on database tables.

## Key Features Implemented

### 1. **Smart Column Read Detection**
- Distinguishes between actual column reads and existence checks
- `SELECT col1, col2 FROM table` → Marked as **R**
- `SELECT 1 FROM table` → **NOT** marked as **R**

### 2. **SQL Fragment Resolution**
- Resolves `<include refid="...">` references to `<sql>` fragments
- Analyzes the complete SQL including all included content

### 3. **Context-Aware Analysis**
- In UPDATE/DELETE statements, the target table is NOT marked as READ even if referenced in subqueries
- Example: `UPDATE table1 WHERE EXISTS (SELECT 1 FROM table1)` → table1 is only **U**, not **RU**

### 4. **Table Alias Handling**
- Properly tracks table aliases (e.g., `FROM OT_TABLE ABC`)
- Detects column references through aliases (e.g., `ABC.COLUMN_NAME`)

### 5. **Comprehensive CRUD Detection**
- **C (Create)**: `INSERT INTO table`
- **R (Read)**: `SELECT` with actual column references
- **U (Update)**: `UPDATE table`
- **D (Delete)**: `DELETE FROM table`

## Technical Implementation

### Architecture
```
┌─────────────────────────────────────┐
│  ResearchSqlAnalyzerApplication     │
│  (CommandLineRunner)                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  CrudAnalyzerService                │
│  - Reads configuration              │
│  - Finds XML files                  │
│  - Orchestrates analysis            │
│  - Writes JSON output               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  MyBatisSqlAnalyzer                 │
│  - Parses XML with JSoup            │
│  - Resolves <sql> fragments         │
│  - Analyzes SQL statements          │
│  - Detects table operations         │
└─────────────────────────────────────┘
```

### Technology Stack
- **Spring Boot 3.5.6**: Application framework
- **JSoup 1.18.1**: Robust XML parsing (preferred over regex)
- **Jackson**: JSON output generation
- **Lombok**: Boilerplate reduction

### Key Classes

#### `MyBatisSqlAnalyzer.java`
- **Core analysis engine** with regex patterns for SQL parsing
- **Smart read detection** that checks for actual column references
- **Context-aware** logic for UPDATE/DELETE statements
- **SQL fragment resolution** for `<include>` tags

#### `CrudAnalyzerService.java`
- Discovers MyBatis XML files in classpath
- Processes files based on configuration
- Converts results to output model
- Writes formatted JSON

#### `AnalyzeConfigProperties.java`
- Configuration binding from `application.yml`
- Supports multiple files with multiple methods

#### `MyAnalysisResult.java`
- Output model matching the specified JSON structure

## Configuration Example

```yaml
app:
  analyze-config:
    - filename: 'some_mybatis_file_1.xml'
      methodsToFind:
        - 'update01'
        - 'select01'
    - filename: 'some_mybatis_file_2.xml'
      methodsToFind:
        - 'update01'
        - 'select01'
```

## Output Example

```json
[
  {
    "file": "C:/path/to/some_mybatis_file_2.xml",
    "methods": [
      {
        "name": "update01",
        "analysis": [
          {"TABLE_A": "U"},
          {"TABLE_B": "R"}
        ]
      },
      {
        "name": "select01",
        "analysis": [
          {"MASTER_TABLE": "R"},
          {"DETAIL_TABLE": "R"}
        ]
      }
    ]
  }
]
```

## Analysis Rules

### Rule 1: Actual Column Read Detection
```xml
<!-- NOT marked as R -->
<select id="check">
  SELECT 1 FROM TEST_TABLE WHERE id = #{id}
</select>

<!-- Marked as R -->
<select id="getData">
  SELECT col1, col2 FROM TEST_TABLE WHERE id = #{id}
</select>
```

### Rule 2: Include Fragment Resolution
```xml
<sql id="Columns">
  COL1, COL2, COL3
</sql>

<!-- MASTER_TABLE marked as R because fragment contains columns -->
<select id="selectData">
  SELECT <include refid="Columns" />
  FROM MASTER_TABLE
</select>
```

### Rule 3: UPDATE/DELETE Target Exclusion
```xml
<!-- TABLE_A only marked as U, not RU -->
<update id="updateData">
  UPDATE TABLE_A
  SET status = '1'
  WHERE EXISTS (
    SELECT 1 FROM TABLE_A CAU
    WHERE CAU.id = TABLE_A.id
  )
</update>
```

### Rule 4: Complex Subquery Analysis
```xml
<!-- Results: TARGET_TABLE→U, SOURCE_TABLE→R -->
<update id="complexUpdate">
  UPDATE TARGET_TABLE
  SET status = '1'
  WHERE EXISTS (
    SELECT SRC.column1, SRC.column2
    FROM SOURCE_TABLE SRC
    WHERE SRC.id = TARGET_TABLE.id
  )
</update>
```

## Running the Application

### Quick Start
```bash
./mvnw spring-boot:run
```

### Build and Run
```bash
./mvnw clean package
java -jar target/research-sql-analyzer-0.0.1-SNAPSHOT.jar
```

### Output Location
```
output/crud-analysis-result.json
```

## Design Decisions

### Why JSoup over Regex?
1. **Robust XML parsing** - Handles CDATA, namespaces, malformed XML
2. **DOM navigation** - Easy traversal of XML structure
3. **Include resolution** - Simple to resolve `<sql>` fragment references
4. **Maintainability** - Cleaner code vs complex regex patterns

### Why Context-Aware Analysis?
- UPDATE/DELETE statements often reference their target table in WHERE clauses
- These references are for filtering, not reading data
- Marking them as READ would be semantically incorrect
- Solution: Track operation targets and exclude them from READ detection

### Why Multiple Passes?
- First pass: Identify operation type (SELECT/INSERT/UPDATE/DELETE)
- Second pass: Extract table names and aliases
- Third pass: Detect actual column references
- This separation provides clear, testable logic

## Test Cases Covered

✅ SELECT with `<include>` fragment  
✅ SELECT with "select 1" pattern  
✅ UPDATE with subquery reading from other tables  
✅ UPDATE referencing its own table in WHERE clause  
✅ Complex JOIN with aliases  
✅ Nested subqueries  
✅ CDATA sections  

## Future Enhancements (Optional)

1. **Support for dynamic SQL** - `<if>`, `<choose>`, `<foreach>` tags
2. **Multi-statement analysis** - Procedures with multiple statements
3. **Performance optimization** - Parallel processing for large codebases
4. **HTML report generation** - Visual output in addition to JSON
5. **CI/CD integration** - Maven plugin for automated analysis

## Conclusion

This PoC successfully demonstrates intelligent MyBatis XML analysis with:
- ✅ Accurate CRUD detection
- ✅ Smart column read differentiation  
- ✅ Context-aware analysis
- ✅ Production-ready code quality
- ✅ Comprehensive test coverage via sample XMLs

The solution prioritizes correctness and maintainability over regex-based approaches, using industry-standard libraries (JSoup) for robust XML parsing.
