package com.example.demo_sqlite_db_file_jpa.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Bean
    RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    GroupedOpenApi restApi() {
        return GroupedOpenApi.builder().group("REST API").pathsToExclude("/actuator/**")
                .pathsToMatch("/**").build();
    }
}
