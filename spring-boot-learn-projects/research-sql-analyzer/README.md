# CRUD Analyzer for MyBatis XML Files

A Spring Boot command-line application that analyzes MyBatis XML mapper files to identify CRUD operations on database tables.

## Features

- Analyzes MyBatis XML files based on configuration
- Detects Create (C), Read (R), Update (U), Delete (D) operations
- Intelligently distinguishes between actual column reads and existence checks (`select 1`)
- Resolves `<include>` references to `<sql>` fragments
- Handles table aliases and subqueries
- Outputs analysis results to JSON file

## How It Works

The analyzer:

1. Reads configuration from `application.yml` specifying which XML files and methods to analyze
2. Parses MyBatis XML files using JSoup
3. Analyzes SQL statements to detect:
   - **Create (C)**: `INSERT INTO` statements
   - **Read (R)**: `SELECT` statements that actually read columns (not just `SELECT 1`)
   - **Update (U)**: `UPDATE` statements
   - **Delete (D)**: `DELETE FROM` statements
4. Outputs results to `output/crud-analysis-result.json`

## Configuration

Edit `src/main/resources/application.yml`:

```yaml
app:
  analyze-config:
    - filename: 'some_mybatis_file_1.xml'
      methodsToFind:
        - 'update01'
        - 'select01'
        - 'select03'
    - filename: 'some_mybatis_file_2.xml'
      methodsToFind:
        - 'update01'
        - 'select01'
```

## Analysis Rules

### Read (R) Detection
- Tables are marked as **R** only if columns are actually selected
- `SELECT 1 FROM table` → **NOT** marked as R
- `SELECT table.column FROM table` → marked as R
- Includes columns from `<sql>` fragment references

### Smart Detection Examples

**Example 1**: With `<include>` reference
```xml
<sql id="Column_List">
  COL1, COL2, COL3
</sql>

<select id="select01">
  SELECT <include refid="Column_List" />
  FROM MASTER_TABLE
</select>
```
Result: `MASTER_TABLE` → **R** (because it reads columns)

**Example 2**: Existence check
```xml
<select id="select03">
  SELECT 1 FROM TEST_TABLE WHERE ID = #{id}
</select>
```
Result: `TEST_TABLE` → **NOT marked** (because it's just existence check)

**Example 3**: Complex UPDATE with subquery
```xml
<update id="update01">
  UPDATE TARGET_TABLE
  SET STATUS = '1'
  WHERE EXISTS (
    SELECT 1 FROM CHECK_TABLE CAU
    JOIN (
      SELECT NKS.COLUMN1, NKS.COLUMN2
      FROM SOURCE_TABLE NKS
    ) D ON D.ID = CAU.ID
  )
</update>
```
Result:
- `TARGET_TABLE` → **U** (update)
- `SOURCE_TABLE` → **R** (reads columns)
- `CHECK_TABLE` → **NOT marked** (only `SELECT 1`)

## Running the Application

### Using Maven

```bash
# Clean and compile
./mvnw clean compile

# Run the application
./mvnw spring-boot:run
```

### Using Java

```bash
# Build the JAR
./mvnw clean package

# Run the JAR
java -jar target/research-sql-analyzer-0.0.1-SNAPSHOT.jar
```

## Output Format

The analyzer generates `output/crud-analysis-result.json`:

```json
[
  {
    "file": "C:/path/to/some_mybatis_file_1.xml",
    "methods": [
      {
        "name": "update01",
        "analysis": [
          {"TARGET_TABLE": "U"},
          {"REFERENCE_TABLE": "R"}
        ]
      },
      {
        "name": "select01",
        "analysis": [
          {"MASTER_TABLE": "R"}
        ]
      }
    ]
  }
]
```

## Dependencies

- Spring Boot 3.5.6
- JSoup 1.18.1 (XML parsing)
- Lombok
- Jackson (JSON processing)

## Project Structure

```
src/main/java/
  └── com.research.sql_analyzer.research_sql_analyzer/
      ├── ResearchSqlAnalyzerApplication.java (Main entry point)
      ├── analyzer/
      │   └── MyBatisSqlAnalyzer.java (Core SQL analysis logic)
      ├── service/
      │   └── CrudAnalyzerService.java (Orchestration service)
      ├── config/
      │   ├── AnalyzeConfigProperties.java (Configuration binding)
      │   └── AppConfig.java (Bean configuration)
      └── model/
          └── MyAnalysisResult.java (Output model)

src/main/resources/
  ├── application.yml (Configuration)
  ├── some_mybatis_file_1.xml (Sample MyBatis mapper)
  └── some_mybatis_file_2.xml (Sample MyBatis mapper)
```

## Notes

- The analyzer uses JSoup for robust XML parsing
- Handles CDATA sections automatically
- Case-insensitive SQL keyword matching
- Supports complex subqueries and JOINs
- Operation codes are ordered: C, R, U, D
- Maximum one set of operations per table (CRUD)

## Output

The analysis results are saved to `output/crud-analysis-result.json`: