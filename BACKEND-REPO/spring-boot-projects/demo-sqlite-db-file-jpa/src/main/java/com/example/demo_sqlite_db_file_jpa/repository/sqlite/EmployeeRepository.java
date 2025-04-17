package com.example.demo_sqlite_db_file_jpa.repository.sqlite;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo_sqlite_db_file_jpa.entity.sqlite.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
