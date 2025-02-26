package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.DataLog;

public interface DataLogRepository extends JpaRepository<DataLog, Long> {
}
