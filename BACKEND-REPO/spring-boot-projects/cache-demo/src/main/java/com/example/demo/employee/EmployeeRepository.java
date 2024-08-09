package com.example.demo.employee;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // find Optioanl Employee by email or name or phone by using @Query,
    // use only 1 @Param keyword
    @Query("SELECT e FROM Employee e WHERE e.email = :email OR e.name = :name OR e.phone = :phone")
    Optional<Employee> findByEmailOrNameOrPhone(
            @Param("email") String email,
            @Param("name") String name,
            @Param("phone") String phone);

    @Query("SELECT e FROM Employee e")
    List<Employee> search(Pageable pageable);

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<Employee> findFirstByOrderByIdDesc();

}
