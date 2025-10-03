package com.example.demo.employee;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.github.javafaker.Faker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    private final EmployeeMapper employeeMapper;

    private static AtomicInteger count = new AtomicInteger(0);

    private static Faker faker = new Faker();

    // @Cacheable(value = "employees", key = "'employeeSearch'")
    public Page<EmployeeModel> getAllEmployees(Integer no, Integer limit, String sortBy, Boolean desc) {
        log.info("Fetching employees from database, count time: {}", count.incrementAndGet());
        Sort sort = Sort.by(Boolean.TRUE.equals(desc) ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(no, limit, sort);
        List<EmployeeModel> employees = employeeRepository.search(pageable).stream()
                .map(employeeMapper::toModel)
                .toList();
        return new PageImpl<>(employees, pageable, employeeRepository.count());
    }

    private final String condition = "#employee.isPresent() && #employee.map(T(com.example.demo.employee.EmployeeModel).getEmployeeCode).isPresent()";
    private final String key = "#employee.map(T(com.example.demo.employee.EmployeeModel).getEmployeeCode).orElse(null)";

    // @CacheEvict(value = "employees", allEntries = true)
    public EmployeeModel createEmployee(Optional<EmployeeModel> employee) {
        log.info("Creating employee: {}", employee);
        // check if employee code already exists
        if (employeeRepository.existsByEmployeeCode(employee.map(EmployeeModel::getEmployeeCode).orElse(null))) {
            throw new RuntimeException("Employee code already exists");
        }
        // check if email already exists
        if (employeeRepository.existsByEmail(employee.map(EmployeeModel::getEmail).orElse(null))) {
            throw new RuntimeException("Email already exists");
        }
        // check if phone already exists
        if (employeeRepository.existsByPhone(employee.map(EmployeeModel::getPhone).orElse(null))) {
            throw new RuntimeException("Phone already exists");
        }
        EmployeeModel mockFaker = randEmpModel();
        Employee saved = employeeRepository.save(employeeMapper.toEntity(mockFaker));
        return employeeMapper.toModel(saved);
    }

    // @Caching(put = {
    // }, cacheable = {
    //         @Cacheable(value = "employees", key = "#id.isPresent() ? 'employee:' + #id.get() : null")
    // })
    public EmployeeModel getEmployee(Optional<Long> id) {
        log.info("Fetching employee with id: {}", id);
        // get employee by id
        if (employeeRepository.existsById(id.orElse(-1L))) {
            return employeeMapper.toModel(employeeRepository.findById(id.orElse(-1L)).orElseThrow());
        }
        // get last employee in the database by id desc
        if (employeeRepository.findFirstByOrderByIdDesc().isPresent()) {
            return employeeMapper.toModel(employeeRepository.findFirstByOrderByIdDesc().orElseThrow());
        }
        throw new RuntimeException("Employee does not exist");
    }

    // @CacheEvict(value = "employees", allEntries = true)
    public void deleteEmployee(Optional<Long> id) {
        log.info("Deleting employee with id: {}", id);
        // check if employee exists
        var find = employeeRepository.findById(id.orElse(null));
        if (find.isEmpty()) {
            throw new RuntimeException("Employee does not exist");
        }
        // delete the last employee in the database id desc by id
        Employee lastEmployee = employeeRepository.findFirstByOrderByIdDesc().orElseThrow();
        employeeRepository.delete(lastEmployee);
    }

    public void populateEmployees() {
        // starting to populate 5000 employees using javafaker
        List<Employee> employeeList = new ArrayList<>();
        for (int i = 0; i < 10_000; i++) {
            Employee employee = employeeMapper.toEntity(randEmpModel());
            employeeList.add(employee);
            System.out.println("Employee " + i + " added");
        }
        employeeRepository.saveAll(employeeList);
    }

    // @Caching(
    //     put = {
    //         @CachePut(value = "employees", key = "#id.isPresent() ? 'employee:' + #id.get() : null")
    //     }
    // )
    public EmployeeModel updateEmployee(Optional<Long> id, Optional<EmployeeModel> employee) {
        log.info("Updating employee with id: {}", id);
        // check if employee exists
        if (!employeeRepository.existsById(id.orElse(null))) {
            throw new RuntimeException("Employee does not exist");
        }
        // check if employee code already exists
        if (employeeRepository.existsByEmployeeCode(employee.map(EmployeeModel::getEmployeeCode).orElse(null))) {
            throw new RuntimeException("Employee code already exists");
        }
        // check if email already exists
        if (employeeRepository.existsByEmail(employee.map(EmployeeModel::getEmail).orElse(null))) {
            throw new RuntimeException("Email already exists");
        }
        // check if phone already exists
        if (employeeRepository.existsByPhone(employee.map(EmployeeModel::getPhone).orElse(null))) {
            throw new RuntimeException("Phone already exists");
        }
        if (employee.isEmpty()) {
            // use javafaker to generate random data
            EmployeeModel mockFaker = randEmpModel();
            employee = Optional.of(mockFaker);
        }
        Employee saved = employeeRepository.save(employeeMapper.toEntity(employee.orElseThrow()));
        return employeeMapper.toModel(saved);
    }

    private EmployeeModel randEmpModel() {
        // use javafaker to generate random data
        return EmployeeModel.builder()
                .employeeCode(faker.number().digits(5))
                .jobTitle(faker.job().title())
                .name(faker.name().fullName())
                .phone(faker.phoneNumber().phoneNumber())
                .imageUrl(faker.internet().image())
                .email(faker.internet().emailAddress())
                .build();
    }

}
