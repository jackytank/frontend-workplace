package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Entity
@Table(name = "data_logs")
public class DataLog implements java.io.Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "log_date")
    private LocalDateTime logDate;

    @Column(name = "log_level")
    @Enumerated(EnumType.ORDINAL)
    private LogLevel logLevel;

    @Column(name = "log_message")
    private String logMessage;

    @Column(name = "log_status")
    @Enumerated(EnumType.ORDINAL)
    private LogStatus logStatus;
}

enum LogLevel {
    INFO, WARN, ERROR
}

enum LogStatus {
    SUCCESS, FAILED
}