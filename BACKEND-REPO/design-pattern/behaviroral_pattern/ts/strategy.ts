// Real-World Example: An E-commerce Checkout System
// An order can be paid for using a Credit Card, PayPal, or Crypto. The payment method (the strategy) can be swapped out without changing the ShoppingCart itself.

interface PaymentStrategy {
    pay(amount: number): void;
}

class CreditCardPayment implements PaymentStrategy {
    constructor(private name: string, private cardNumber: string) { }

    pay(amount: number): void {
        console.log(`Paid ${amount} using Credit Card: ${this.cardNumber}`);
    }
}

class PaypalPayment implements PaymentStrategy {
    constructor(private email: string) {

    }

    pay(amount: number): void {
        console.log(`Paid ${amount} using PayPal account: ${this.email}`);
    }
}

class CryptoPayment implements PaymentStrategy {
    constructor(private walletAddress: string) {

    }

    pay(amount: number): void {
        console.log(`Paid ${amount} using Crypto wallet: ${this.walletAddress}`);
    }
}

// The class that uses a strategy. It doesn't know the details of the strategy,
// it just knows how to use it through the interface.
class ShoppingCart {
    private readonly amount: number = 0;
    private paymentStrategy!: PaymentStrategy;

    constructor(amount: number) {
        this.amount = amount;
    }

    setPaymentStrategy(strategy: PaymentStrategy): void {
        this.paymentStrategy = strategy;
    }

    public checkout(): void {
        if (!this.paymentStrategy) {
            throw new Error('payment strategy not set');
        }

        this.paymentStrategy.pay(this.amount);
    }
}

// USAGE:
const cart = new ShoppingCart(250);
// pay with credit card
const creditCard = new CreditCardPayment('Join Doe', '1234-5678-9012-3456');
cart.setPaymentStrategy(creditCard);
cart.checkout();

console.log('--- change method ---');
const paypal = new PaypalPayment('john.doe@hehe.haha');
cart.setPaymentStrategy(paypal);
cart.checkout();
