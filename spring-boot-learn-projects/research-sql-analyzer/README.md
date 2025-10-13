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

## Output

The analysis results are saved to `output/crud-analysis-result.json`: