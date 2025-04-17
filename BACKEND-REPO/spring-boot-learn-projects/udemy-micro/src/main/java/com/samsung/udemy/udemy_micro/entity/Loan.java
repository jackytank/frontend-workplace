package com.samsung.udemy.udemy_micro.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "customer")
@Entity
@Table(name = "loans", indexes = {
        @Index(name = "idx_loan_type", columnList = "loanType"),
        @Index(name = "idx_loan_status", columnList = "status"),
        @Index(name = "idx_loan_amount", columnList = "loanAmount")
})
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String loanNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal loanAmount;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal outstandingBalance;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal interestRate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LoanType loanType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LoanStatus status;

    @Column(nullable = false)
    private LocalDateTime originationDate;

    @Column(nullable = false)
    private LocalDate maturityDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyPayment;

    @Column(nullable = false)
    private Integer termMonths;

    @Column(length = 200)
    private String collateralDescription;

    @Column(nullable = false)
    private Boolean isSecured;

    @Column(nullable = false)
    private String currencyCode;

    @Column(columnDefinition = "TEXT")
    private String loanTerms;

    @Column(nullable = false)
    private LocalDate nextPaymentDue;

    @Column(nullable = false)
    private Integer paymentsMade;

    @Column(nullable = false)
    private Integer paymentsRemaining;

    public enum LoanType {
        PERSONAL, AUTO, MORTGAGE, STUDENT, BUSINESS, HOME_EQUITY, CREDIT_BUILDER, PAYDAY, SECURED, UNSECURED
    }

    public enum LoanStatus {
        PENDING, APPROVED, ACTIVE, PAID_OFF, DEFAULTED, REFINANCED, IN_COLLECTIONS, CLOSED
    }
}