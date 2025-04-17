package com.samsung.udemy.udemy_micro.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.samsung.udemy.udemy_micro.entity.Customer;

@RepositoryRestResource(collectionResourceRel = "customers", path = "customers")
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByEmail(String email);

    List<Customer> findByLastName(String lastName);

    List<Customer> findByRiskScoreGreaterThan(Double riskScore);

    List<Customer> findByIsActiveTrue();
}