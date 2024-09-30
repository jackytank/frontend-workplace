package jp.co.kepco.mdky.smlib;

import java.io.BufferedReader;
import java.io.FileReader;
import com.opencsv.CSVReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.regex.Pattern;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
/**
 * CSV Utils
 */
public class CsvUtils {

    private final String schemaPath = "schema.csv";

    /**
     * Read CSV structure
     * @param s3Client
     * @param bucketName
     * @param key
     * @return
     */
    
    public BufferedReader readCsv(S3Client s3Client, String bucketName, String key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        return new BufferedReader(new InputStreamReader(
            s3Client.getObject(getObjectRequest), StandardCharsets.UTF_8));
    }

    /**
     * CSV schema define fields for validation
     * @param schemaPath
     * @return
     * @throws Exception
     */
    public List<String[]> loadValidationSchema() 
    {
        try (CSVReader reader = new CSVReader(new FileReader(schemaPath))) {
            return reader.readAll();
        }catch (Exception ex) {
            throw new IllegalArgumentException("CsvUtils.loadValidationSchema. CSV file is invalid.");
        }
    }
    /**
     * Validation Header CSV
     */

    public boolean validation(List<String> headerList)
    {
        // Validate number of column header

        
        return true;
    }
    /**
     * Validate each line csv
     * @param columns
     * @return boolean TRUE/FALSE
     */
     public boolean validateLine(String[] columns) {
        List<String[]> schema = loadValidationSchema();
        for (int i = 0; i < columns.length; i++) {
            // Second column in schema contains regex patterns
            String pattern = schema.get(i)[1];
            if (!Pattern.matches(pattern, columns[i])) {
                return false;
            }
        }
        return true;
    }
    
}
