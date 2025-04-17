package com.example.demo.employee;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("")
    @ResponseStatus(code = HttpStatus.OK)
    public ResponseEntity<?> getEmployees(
            @RequestParam(defaultValue = "0") Integer no,
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(required = false, defaultValue = "true") Boolean desc) {
        return ResponseEntity.ok(employeeService.getAllEmployees(no, limit, sortBy, desc));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable(required = false) Optional<Long> id) {
        return ResponseEntity.ok(employeeService.getEmployee(id));
    }

    @PostMapping("")
    public ResponseEntity<?> createEmployee(@RequestBody(required = false) Optional<EmployeeModel> employee) {
        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(
            @PathVariable(required = false) Optional<Long> id,
            @RequestBody(required = false) Optional<EmployeeModel> employee) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable(required = false) Optional<Long> id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

}
