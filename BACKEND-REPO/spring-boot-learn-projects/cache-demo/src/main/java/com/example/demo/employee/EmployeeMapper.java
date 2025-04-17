package com.example.demo.employee;

import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {
    public EmployeeModel toModel(Employee employee) {
        return EmployeeModel.builder()
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .jobTitle(employee.getJobTitle())
                .phone(employee.getPhone())
                .imageUrl(employee.getImageUrl())
                .employeeCode(employee.getEmployeeCode())
                .build();
    }

    public Employee toEntity(EmployeeModel employeeModel) {
        return Employee.builder()
                .id(employeeModel.getId())
                .name(employeeModel.getName())
                .email(employeeModel.getEmail())
                .jobTitle(employeeModel.getJobTitle())
                .phone(employeeModel.getPhone())
                .imageUrl(employeeModel.getImageUrl())
                .employeeCode(employeeModel.getEmployeeCode())
                .build();
    }
}
