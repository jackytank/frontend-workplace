package com.samsung.udemy.udemy_micro;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.Transactional;

import com.github.javafaker.Faker;
import com.samsung.udemy.udemy_micro.entity.Account;
import com.samsung.udemy.udemy_micro.entity.Account.AccountStatus;
import com.samsung.udemy.udemy_micro.entity.Account.AccountType;
import com.samsung.udemy.udemy_micro.entity.Customer;
import com.samsung.udemy.udemy_micro.entity.Transaction;
import com.samsung.udemy.udemy_micro.entity.Transaction.TransactionStatus;
import com.samsung.udemy.udemy_micro.entity.Transaction.TransactionType;
import com.samsung.udemy.udemy_micro.entity.User;
import com.samsung.udemy.udemy_micro.entity.Loan;
import com.samsung.udemy.udemy_micro.entity.Loan.LoanStatus;
import com.samsung.udemy.udemy_micro.entity.Loan.LoanType;
import com.samsung.udemy.udemy_micro.repository.AccountRepository;
import com.samsung.udemy.udemy_micro.repository.CustomerRepository;
import com.samsung.udemy.udemy_micro.repository.TransactionRepository;
import com.samsung.udemy.udemy_micro.repository.UserRepository;
import com.samsung.udemy.udemy_micro.repository.LoanRepository;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
public class UdemyMicroApplication implements CommandLineRunner {

	private final UserRepository userRepository;
	private final CustomerRepository customerRepository;
	private final AccountRepository accountRepository;
	private final TransactionRepository transactionRepository;
	private final LoanRepository loanRepository;

	private final Faker faker = new Faker();
	private static final int BATCH_SIZE = 10000;
	private static final int TOTAL_RECORDS = 10_000;
	private static final String[] CURRENCY_CODES = { "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF" };
	private static final String[] MERCHANT_CATEGORIES = {
			"Retail", "Restaurant", "Travel", "Entertainment", "Utilities",
			"Healthcare", "Education", "Groceries", "Electronics", "Home Improvement"
	};

	public static void main(String[] args) {
		SpringApplication.run(UdemyMicroApplication.class, args);
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception {
		// System.out.println("Starting data population...");
		// long startTime = System.currentTimeMillis();

		// // Populate customers
		// System.out.println("Populating customers...");
		// this.populateCustomers();

		// // Populate accounts
		// System.out.println("Populating accounts...");
		// this.populateAccounts();

		// // Populate loans
		// System.out.println("Populating loans...");
		// this.populateLoans();

		// // Populate transactions
		// System.out.println("Populating transactions...");
		// this.populateTransactions();

		// long endTime = System.currentTimeMillis();
		// System.out.printf("Total execution time: %.2f seconds%n", (endTime - startTime) / 1000.0);
	}

	private void populateCustomers() {
		final AtomicLong counter = new AtomicLong(0);

		for (int batch = 0; batch < TOTAL_RECORDS; batch += BATCH_SIZE) {
			final List<Customer> customers = new ArrayList<>();

			for (int i = 0; i < BATCH_SIZE && batch + i < TOTAL_RECORDS; i++) {
				final long currentCount = counter.incrementAndGet();

				final Customer customer = Customer.builder()
						.firstName(this.faker.name().firstName())
						.lastName(this.faker.name().lastName())
						.email("customer_" + currentCount + "@" + this.faker.internet().domainName())
						.phoneNumber(this.faker.phoneNumber().phoneNumber())
						.dateOfBirth(this.getRandomDateOfBirth())
						.address(this.faker.address().fullAddress())
						.taxId(this.faker.idNumber().validSvSeSsn())
						.riskScore(ThreadLocalRandom.current().nextDouble(0, 100))
						.isActive(ThreadLocalRandom.current().nextBoolean())
						.onboardingDate(LocalDate.now().minusDays(ThreadLocalRandom.current().nextInt(1, 3650)))
						.customerProfile(this.generateCustomerProfile())
						.build();

				customers.add(customer);
			}

			this.customerRepository.saveAll(customers);
			System.out.printf("Saved %d customers%n", batch + customers.size());
		}
	}

	private LocalDate getRandomDateOfBirth() {
		return this.faker.date().birthday(18, 90).toInstant()
				.atZone(ZoneId.systemDefault())
				.toLocalDate();
	}

	private String generateCustomerProfile() {
		final Map<String, Object> profile = new HashMap<>();
		profile.put("income", ThreadLocalRandom.current().nextInt(30000, 250000));
		profile.put("occupation", this.faker.job().title());
		profile.put("employmentStatus",
				this.faker.options().option("Employed", "Self-Employed", "Unemployed", "Retired"));
		profile.put("maritalStatus", this.faker.demographic().maritalStatus());
		profile.put("education", this.faker.options().option("High School", "Bachelor", "Master", "PhD"));

		return profile.toString();
	}

	private void populateAccounts() {
		final List<Customer> allCustomers = this.customerRepository.findAll();
		if (allCustomers.isEmpty()) {
			System.out.println("No customers found. Cannot create accounts.");
			return;
		}

		final AtomicLong counter = new AtomicLong(0);

		for (int batch = 0; batch < TOTAL_RECORDS; batch += BATCH_SIZE) {
			final List<Account> accounts = new ArrayList<>();

			for (int i = 0; i < BATCH_SIZE && batch + i < TOTAL_RECORDS; i++) {
				final long currentCount = counter.incrementAndGet();
				final Customer randomCustomer = allCustomers
						.get(ThreadLocalRandom.current().nextInt(allCustomers.size()));
				final AccountType accountType = this.getRandomAccountType();
				final BigDecimal balance = new BigDecimal(ThreadLocalRandom.current().nextDouble(100, 100000))
						.setScale(2, BigDecimal.ROUND_HALF_UP);

				final Account account = Account.builder()
						.accountNumber("ACC" + String.format("%015d", currentCount))
						.customer(randomCustomer)
						.balance(balance)
						.availableBalance(
								balance.subtract(new BigDecimal(ThreadLocalRandom.current().nextDouble(0, 100))
										.setScale(2, BigDecimal.ROUND_HALF_UP)))
						.accountType(accountType)
						.status(this.getRandomAccountStatus())
						.openDate(LocalDateTime.now().minusMonths(ThreadLocalRandom.current().nextInt(1, 60)))
						.currencyCode(CURRENCY_CODES[ThreadLocalRandom.current().nextInt(CURRENCY_CODES.length)])
						.annualPercentageYield(new BigDecimal(ThreadLocalRandom.current().nextDouble(0.01, 5.0))
								.setScale(2, BigDecimal.ROUND_HALF_UP))
						.overdraftProtection(ThreadLocalRandom.current().nextBoolean())
						.build();

				if (account.getOverdraftProtection()) {
					account.setOverdraftLimit(new BigDecimal(ThreadLocalRandom.current().nextDouble(100, 5000))
							.setScale(2, BigDecimal.ROUND_HALF_UP));
				}

				accounts.add(account);
			}

			this.accountRepository.saveAll(accounts);
			System.out.printf("Saved %d accounts%n", batch + accounts.size());
		}
	}

	private AccountType getRandomAccountType() {
		final AccountType[] values = AccountType.values();
		return values[ThreadLocalRandom.current().nextInt(values.length)];
	}

	private AccountStatus getRandomAccountStatus() {
		// Mostly active accounts
		if (ThreadLocalRandom.current().nextDouble() < 0.8) {
			return AccountStatus.ACTIVE;
		}

		final AccountStatus[] values = AccountStatus.values();
		return values[ThreadLocalRandom.current().nextInt(values.length)];
	}

	private void populateLoans() {
		final List<Customer> allCustomers = this.customerRepository.findAll();
		if (allCustomers.isEmpty()) {
			System.out.println("No customers found. Cannot create loans.");
			return;
		}

		final AtomicLong counter = new AtomicLong(0);

		for (int batch = 0; batch < TOTAL_RECORDS; batch += BATCH_SIZE) {
			final List<Loan> loans = new ArrayList<>();

			for (int i = 0; i < BATCH_SIZE && batch + i < TOTAL_RECORDS; i++) {
				final long currentCount = counter.incrementAndGet();
				final Customer randomCustomer = allCustomers
						.get(ThreadLocalRandom.current().nextInt(allCustomers.size()));
				final LoanType loanType = this.getRandomLoanType();
				final int termMonths = this.getLoanTermForType(loanType);
				final BigDecimal loanAmount = this.getLoanAmountForType(loanType);
				final BigDecimal interestRate = new BigDecimal(ThreadLocalRandom.current().nextDouble(2.0, 18.0))
						.setScale(2, BigDecimal.ROUND_HALF_UP);

				// Calculate a random progress through the loan term
				final int monthsIntoLoan = ThreadLocalRandom.current().nextInt(0, termMonths + 1);
				final LocalDateTime originationDate = LocalDateTime.now().minusMonths(monthsIntoLoan);
				final LocalDate maturityDate = originationDate.toLocalDate().plusMonths(termMonths);

				// Calculate monthly payment (simple calculation)
				final BigDecimal monthlyRate = interestRate.divide(new BigDecimal("1200"), 10,
						BigDecimal.ROUND_HALF_UP);
				final BigDecimal onePlusRate = monthlyRate.add(BigDecimal.ONE);
				final BigDecimal compoundFactor = onePlusRate.pow(termMonths);
				final BigDecimal monthlyPayment = loanAmount
						.multiply(monthlyRate)
						.multiply(compoundFactor)
						.divide(compoundFactor.subtract(BigDecimal.ONE), 2, BigDecimal.ROUND_HALF_UP);

				// Calculate outstanding balance (simple approximation)
				final BigDecimal paymentsMade = new BigDecimal(monthsIntoLoan);
				final BigDecimal totalPayments = paymentsMade.multiply(monthlyPayment);
				final BigDecimal interestPaid = loanAmount
						.multiply(interestRate.divide(new BigDecimal("100"), 10, BigDecimal.ROUND_HALF_UP))
						.multiply(paymentsMade.divide(new BigDecimal("12"), 10, BigDecimal.ROUND_HALF_UP));
				final BigDecimal principalPaid = totalPayments.subtract(interestPaid);
				final BigDecimal outstandingBalance = loanAmount.subtract(principalPaid);

				// Adjust if balance went negative due to calculation approximation
				final BigDecimal finalOutstandingBalance = outstandingBalance.compareTo(BigDecimal.ZERO) > 0
						? outstandingBalance
						: BigDecimal.ZERO;

				final Loan loan = Loan.builder()
						.loanNumber("LOAN" + String.format("%015d", currentCount))
						.customer(randomCustomer)
						.loanAmount(loanAmount)
						.outstandingBalance(finalOutstandingBalance)
						.interestRate(interestRate)
						.loanType(loanType)
						.status(this.getLoanStatus(finalOutstandingBalance, loanAmount))
						.originationDate(originationDate)
						.maturityDate(maturityDate)
						.monthlyPayment(monthlyPayment)
						.termMonths(termMonths)
						.isSecured(this.isLoanSecured(loanType))
						.currencyCode(CURRENCY_CODES[ThreadLocalRandom.current().nextInt(CURRENCY_CODES.length)])
						.loanTerms(this.generateLoanTerms(loanType))
						.paymentsMade(monthsIntoLoan)
						.paymentsRemaining(termMonths - monthsIntoLoan)
						.nextPaymentDue(LocalDate.now().plusMonths(1))
						.build();

				if (loan.getIsSecured()) {
					loan.setCollateralDescription(this.generateCollateralDescription(loanType));
				}

				loans.add(loan);
			}

			this.loanRepository.saveAll(loans);
			System.out.printf("Saved %d loans%n", batch + loans.size());
		}
	}

	private LoanType getRandomLoanType() {
		final LoanType[] values = LoanType.values();
		return values[ThreadLocalRandom.current().nextInt(values.length)];
	}

	private int getLoanTermForType(LoanType loanType) {
		switch (loanType) {
			case MORTGAGE:
				return ThreadLocalRandom.current().nextInt(120, 361); // 10-30 years
			case STUDENT:
				return ThreadLocalRandom.current().nextInt(60, 241); // 5-20 years
			case AUTO:
				return ThreadLocalRandom.current().nextInt(36, 85); // 3-7 years
			case BUSINESS:
				return ThreadLocalRandom.current().nextInt(12, 121); // 1-10 years
			case HOME_EQUITY:
				return ThreadLocalRandom.current().nextInt(60, 241); // 5-20 years
			case PERSONAL:
				return ThreadLocalRandom.current().nextInt(6, 61); // 6-60 months
			case CREDIT_BUILDER:
				return ThreadLocalRandom.current().nextInt(6, 25); // 6-24 months
			case PAYDAY:
				return ThreadLocalRandom.current().nextInt(1, 4); // 1-3 months
			default:
				return ThreadLocalRandom.current().nextInt(12, 61); // 1-5 years
		}
	}

	private BigDecimal getLoanAmountForType(LoanType loanType) {
		switch (loanType) {
			case MORTGAGE:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(100000, 1000000)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
			case STUDENT:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(5000, 100000)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
			case AUTO:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(5000, 50000)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
			case BUSINESS:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(10000, 500000)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
			case HOME_EQUITY:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(20000, 200000)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
			case PERSONAL:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(1000, 30000)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
			case CREDIT_BUILDER:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(500, 3000)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
			case PAYDAY:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(100, 1500)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
			default:
				return new BigDecimal(ThreadLocalRandom.current().nextDouble(1000, 20000)).setScale(2,
						BigDecimal.ROUND_HALF_UP);
		}
	}

	private LoanStatus getLoanStatus(BigDecimal outstandingBalance, BigDecimal loanAmount) {
		if (outstandingBalance.compareTo(BigDecimal.ZERO) == 0) {
			return LoanStatus.PAID_OFF;
		}

		if (ThreadLocalRandom.current().nextDouble() < 0.03) {
			return ThreadLocalRandom.current().nextBoolean() ? LoanStatus.DEFAULTED : LoanStatus.IN_COLLECTIONS;
		}

		if (ThreadLocalRandom.current().nextDouble() < 0.02) {
			return LoanStatus.REFINANCED;
		}

		if (ThreadLocalRandom.current().nextDouble() < 0.05) {
			return ThreadLocalRandom.current().nextBoolean() ? LoanStatus.PENDING : LoanStatus.APPROVED;
		}

		return LoanStatus.ACTIVE;
	}

	private Boolean isLoanSecured(LoanType loanType) {
		switch (loanType) {
			case MORTGAGE:
			case AUTO:
			case HOME_EQUITY:
			case SECURED:
				return true;
			case UNSECURED:
				return false;
			default:
				return ThreadLocalRandom.current().nextBoolean();
		}
	}

	private String generateCollateralDescription(LoanType loanType) {
		switch (loanType) {
			case MORTGAGE:
			case HOME_EQUITY:
				return "Property at " + this.faker.address().fullAddress();
			case AUTO:
				return this.faker.options().option(
						this.faker.company().name() + " " + this.faker.commerce().productName() + " ("
								+ this.faker.numerify("####") + ")",
						"Toyota " + this.faker.options().option("Camry", "Corolla", "RAV4") + " ("
								+ this.faker.numerify("####") + ")",
						"Honda " + this.faker.options().option("Civic", "Accord", "CR-V") + " ("
								+ this.faker.numerify("####") + ")",
						"Ford " + this.faker.options().option("F-150", "Escape", "Explorer") + " ("
								+ this.faker.numerify("####") + ")");
			default:
				return this.faker.options().option(
						"Certificate of Deposit",
						"Stock Portfolio",
						"Savings Account",
						"Bond Holdings",
						"Valuable Art Collection",
						"Jewelry",
						"Equipment");
		}
	}

	private String generateLoanTerms(LoanType loanType) {
		final Map<String, Object> terms = new HashMap<>();
		terms.put("prepaymentPenalty", ThreadLocalRandom.current().nextBoolean());
		terms.put("latePaymentFee",
				new BigDecimal(ThreadLocalRandom.current().nextDouble(15, 50)).setScale(2, BigDecimal.ROUND_HALF_UP));
		terms.put("originationFee",
				new BigDecimal(ThreadLocalRandom.current().nextDouble(0, 3)).setScale(2, BigDecimal.ROUND_HALF_UP));
		terms.put("autoPayDiscount", new BigDecimal("0.25"));
		terms.put("paymentDueDay", ThreadLocalRandom.current().nextInt(1, 29));

		if (loanType == LoanType.MORTGAGE || loanType == LoanType.HOME_EQUITY) {
			terms.put("escrowRequired", ThreadLocalRandom.current().nextBoolean());
			terms.put("propertyTaxes", ThreadLocalRandom.current().nextBoolean());
			terms.put("homeownersInsurance", ThreadLocalRandom.current().nextBoolean());
		}

		if (loanType == LoanType.STUDENT) {
			terms.put("defermentOption", ThreadLocalRandom.current().nextBoolean());
			terms.put("forbearanceOption", ThreadLocalRandom.current().nextBoolean());
			terms.put("incomeDrivenRepayment", ThreadLocalRandom.current().nextBoolean());
		}

		return terms.toString();
	}

	private void populateTransactions() {
		final List<Account> allAccounts = this.accountRepository.findAll();
		if (allAccounts.isEmpty()) {
			System.out.println("No accounts found. Cannot create transactions.");
			return;
		}

		final Map<Long, List<Account>> accountsByCustomerId = allAccounts.stream()
				.collect(Collectors.groupingBy(account -> account.getCustomer().getId()));

		for (int batch = 0; batch < TOTAL_RECORDS; batch += BATCH_SIZE) {
			final List<Transaction> transactions = new ArrayList<>();

			for (int i = 0; i < BATCH_SIZE && batch + i < TOTAL_RECORDS; i++) {
				final Account sourceAccount = allAccounts.get(ThreadLocalRandom.current().nextInt(allAccounts.size()));
				final TransactionType transactionType = this.getRandomTransactionType();

				final Transaction.TransactionBuilder builder = Transaction.builder()
						.referenceNumber(UUID.randomUUID().toString())
						.account(sourceAccount)
						.amount(new BigDecimal(ThreadLocalRandom.current().nextDouble(1, 5000)).setScale(2,
								BigDecimal.ROUND_HALF_UP))
						.transactionDate(LocalDateTime.now().minusDays(ThreadLocalRandom.current().nextInt(365)))
						.transactionType(transactionType)
						.status(this.getRandomTransactionStatus())
						.description(this.generateTransactionDescription(transactionType))
						.currencyCode(sourceAccount.getCurrencyCode());

				if (transactionType == TransactionType.TRANSFER || transactionType == TransactionType.PAYMENT) {
					// Get another account from a different customer
					final List<Account> otherCustomerAccounts = this
							.getOtherCustomerAccounts(sourceAccount.getCustomer().getId(), accountsByCustomerId);
					if (!otherCustomerAccounts.isEmpty()) {
						builder.receiverAccount(otherCustomerAccounts
								.get(ThreadLocalRandom.current().nextInt(otherCustomerAccounts.size())));
					}
				}

				if (transactionType == TransactionType.PURCHASE) {
					builder.merchantName(this.faker.company().name());
					builder.merchantCategory(
							MERCHANT_CATEGORIES[ThreadLocalRandom.current().nextInt(MERCHANT_CATEGORIES.length)]);
				}

				// Add fee for some transaction types
				if (transactionType == TransactionType.TRANSFER || transactionType == TransactionType.WITHDRAWAL) {
					builder.feeAmount(new BigDecimal(ThreadLocalRandom.current().nextDouble(0.1, 25)).setScale(2,
							BigDecimal.ROUND_HALF_UP));
				}

				// Add exchange rate for foreign currency transactions
				if (!sourceAccount.getCurrencyCode().equals("USD") && ThreadLocalRandom.current().nextBoolean()) {
					builder.exchangeRate(new BigDecimal(ThreadLocalRandom.current().nextDouble(0.5, 2.0)).setScale(4,
							BigDecimal.ROUND_HALF_UP));
				}

				// Add metadata for some transactions
				if (ThreadLocalRandom.current().nextBoolean()) {
					builder.metadata(this.generateTransactionMetadata());
				}

				transactions.add(builder.build());
			}

			this.transactionRepository.saveAll(transactions);
			System.out.printf("Saved %d transactions%n", batch + transactions.size());
		}
	}

	private List<Account> getOtherCustomerAccounts(Long currentCustomerId,
			Map<Long, List<Account>> accountsByCustomerId) {
		List<Account> result = new ArrayList<>();
		accountsByCustomerId.forEach((customerId, accounts) -> {
			if (!customerId.equals(currentCustomerId)) {
				result.addAll(accounts);
			}
		});
		return result.isEmpty() ? new ArrayList<>() : result;
	}

	private TransactionType getRandomTransactionType() {
		final TransactionType[] values = TransactionType.values();
		return values[ThreadLocalRandom.current().nextInt(values.length)];
	}

	private TransactionStatus getRandomTransactionStatus() {
		// Most transactions should be completed
		if (ThreadLocalRandom.current().nextDouble() < 0.9) {
			return TransactionStatus.COMPLETED;
		}

		final TransactionStatus[] values = TransactionStatus.values();
		return values[ThreadLocalRandom.current().nextInt(values.length)];
	}

	private String generateTransactionDescription(TransactionType type) {
		switch (type) {
			case DEPOSIT:
				return "Deposit: " + this.faker.options().option("Paycheck", "Cash Deposit", "Check Deposit",
						"Wire Transfer", "Mobile Deposit");
			case WITHDRAWAL:
				return "Withdrawal: " + this.faker.options().option("ATM", "Teller", "Cash Back", "Wire Transfer");
			case TRANSFER:
				return "Transfer to account ending with " + this.faker.numerify("####");
			case PAYMENT:
				return "Payment: " + this.faker.options().option("Utility Bill", "Rent", "Mortgage", "Car Loan",
						"Credit Card", "Insurance");
			case PURCHASE:
				return "Purchase at " + this.faker.company().name();
			case REFUND:
				return "Refund from " + this.faker.company().name();
			case FEE:
				return "Fee: " + this.faker.options().option("Monthly Service", "Overdraft", "ATM", "Wire Transfer",
						"Late Payment");
			case INTEREST:
				return "Interest Payment";
			case LOAN_DISBURSEMENT:
				return "Loan Disbursement - " + this.faker.options().option("Personal", "Auto", "Home", "Education");
			case LOAN_PAYMENT:
				return "Loan Payment - " + this.faker.options().option("Personal", "Auto", "Home", "Education");
			default:
				return "Transaction";
		}
	}

	private String generateTransactionMetadata() {
		final Map<String, Object> metadata = new HashMap<>();
		metadata.put("ipAddress", this.faker.internet().ipV4Address());
		metadata.put("userAgent", this.faker.internet().userAgentAny());
		metadata.put("location", this.faker.address().cityName() + ", " + this.faker.address().stateAbbr());
		metadata.put("deviceId", UUID.randomUUID().toString());
		return metadata.toString();
	}
}
