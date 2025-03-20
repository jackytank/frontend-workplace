package com.samsung.udemy.udemy_micro.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.samsung.udemy.udemy_micro.entity.Customer;
import com.samsung.udemy.udemy_micro.entity.Loan;
import com.samsung.udemy.udemy_micro.entity.Loan.LoanStatus;
import com.samsung.udemy.udemy_micro.entity.Loan.LoanType;

@RepositoryRestResource(collectionResourceRel = "loans", path = "loans")
public interface LoanRepository extends JpaRepository<Loan, Long> {

    Optional<Loan> findByLoanNumber(String loanNumber);

    List<Loan> findByCustomer(Customer customer);

    List<Loan> findByLoanType(LoanType loanType);

    List<Loan> findByStatus(LoanStatus status);

    List<Loan> findByInterestRateGreaterThan(BigDecimal rate);

    List<Loan> findByLoanAmountBetween(BigDecimal min, BigDecimal max);

    List<Loan> findByMaturityDateBefore(LocalDate date);

    List<Loan> findByNextPaymentDueBefore(LocalDate date);

    @Query("SELECT l FROM Loan l WHERE l.outstandingBalance / l.loanAmount > 0.9 AND l.status = 'ACTIVE'")
    List<Loan> findHighRiskLoans();

    @Query("SELECT l FROM Loan l WHERE l.customer.id = :customerId AND l.outstandingBalance > 0 ORDER BY l.interestRate DESC")
    List<Loan> findCustomerActiveLoansOrderByInterestRate(@Param("customerId") Long customerId);
}