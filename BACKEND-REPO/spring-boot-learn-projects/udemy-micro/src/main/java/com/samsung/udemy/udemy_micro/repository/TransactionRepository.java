package com.samsung.udemy.udemy_micro.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.samsung.udemy.udemy_micro.entity.Account;
import com.samsung.udemy.udemy_micro.entity.Transaction;
import com.samsung.udemy.udemy_micro.entity.Transaction.TransactionStatus;
import com.samsung.udemy.udemy_micro.entity.Transaction.TransactionType;

@RepositoryRestResource(collectionResourceRel = "transactions", path = "transactions")
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByReferenceNumber(String referenceNumber);

    List<Transaction> findByAccount(Account account);

    List<Transaction> findByReceiverAccount(Account receiverAccount);

    List<Transaction> findByTransactionType(TransactionType transactionType);

    List<Transaction> findByStatus(TransactionStatus status);

    List<Transaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<Transaction> findByAmountGreaterThan(BigDecimal amount);

    @Query("SELECT t FROM Transaction t WHERE t.account = :account AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findAccountStatementForPeriod(@Param("account") Account account,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.account = :account AND t.transactionType = :type AND t.status = 'COMPLETED' AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTransactionsByTypeAndPeriod(@Param("account") Account account, @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}