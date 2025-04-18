package com.mcp.learn_mcp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

import com.mcp.learn_mcp.constant.AppConstant;

@Configuration
public class AppConfig {

    // RestClient
    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl(AppConstant.BASE_URL)
                .defaultHeader("Accept", "application/geo+json")
                .defaultHeader("User-Agent", "WeatherApiClient/1.0 (your@email.com)")
                .build();
    }
}
