package com.samsung.udemy.udemy_micro.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.samsung.udemy.udemy_micro.entity.Account;
import com.samsung.udemy.udemy_micro.entity.Account.AccountStatus;
import com.samsung.udemy.udemy_micro.entity.Account.AccountType;
import com.samsung.udemy.udemy_micro.entity.Customer;

@RepositoryRestResource(collectionResourceRel = "accounts", path = "accounts")
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByCustomer(Customer customer);

    List<Account> findByAccountType(AccountType accountType);

    List<Account> findByStatus(AccountStatus status);

    List<Account> findByBalanceGreaterThan(BigDecimal amount);

    @Query("SELECT a FROM Account a WHERE a.balance > :minBalance AND a.accountType = :type")
    List<Account> findHighValueAccountsByType(@Param("minBalance") BigDecimal minBalance,
            @Param("type") AccountType type);
}