package com.example.demo_sqlite_db_file_jpa.util;

import java.util.Properties;

import javax.sql.DataSource;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.stereotype.Component;

@Component
public class DynamicDataSourceFactory {
    public LocalContainerEntityManagerFactoryBean createEntityManagerFactory(String dbPath) {
        final var em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(createDataSource(dbPath));
        em.setPackagesToScan("com.example.demo_sqlite_db_file_jpa.entity");
        
        final var vendorAdapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(vendorAdapter);

        final var properties = new Properties();
        properties.setProperty("hibernate.dialect", "org.hibernate.community.dialect.SQLiteDialect");
        properties.setProperty("hibernate.hbm2ddl.auto", "none");
        properties.setProperty("hibernate.format_sql", "true");
        properties.setProperty("hibernate.show_sql", "true");

        em.setJpaProperties(properties);
        em.afterPropertiesSet();
        
        return em;
    }

    private DataSource createDataSource(String dbPath) {
        return DataSourceBuilder.create()
                .driverClassName("org.sqlite.JDBC")
                .url("jdbc:sqlite:" + dbPath)
                .build();
    }

}
