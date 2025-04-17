package com.samsung.udemy.udemy_micro.entity;

import java.math.BigDecimal;
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
@Table(name = "accounts", indexes = {
        @Index(name = "idx_account_number", columnList = "accountNumber"),
        @Index(name = "idx_account_type", columnList = "accountType"),
        @Index(name = "idx_account_balance", columnList = "balance")
})
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String accountNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal balance;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal availableBalance;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountStatus status;

    @Column(nullable = false)
    private LocalDateTime openDate;

    @Column
    private LocalDateTime closeDate;

    @Column(nullable = false)
    private String currencyCode;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal annualPercentageYield;

    @Column(nullable = false)
    private Boolean overdraftProtection;

    @Column
    private BigDecimal overdraftLimit;

    public enum AccountType {
        CHECKING, SAVINGS, MONEY_MARKET, CERTIFICATE_OF_DEPOSIT, RETIREMENT, INVESTMENT
    }

    public enum AccountStatus {
        ACTIVE, INACTIVE, CLOSED, FROZEN, PENDING
    }
}