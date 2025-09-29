interface Observer {
    update(subject: Subject): void;
}

interface Subject {
    attach(observer: Observer): void;
    detach(observer: Observer): void;
    notify(): void;
}

class Product implements Subject {
    public price: number;
    private readonly observers: Observer[] = [];

    constructor(initialPrice: number) {
        this.price = initialPrice;
    }

    public attach(observer: Observer): void {
        const isExist = this.observers.includes(observer);
        if (!isExist) {
            this.observers.push(observer);
        }
    }

    public detach(observer: Observer): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex !== -1) {
            this.observers.splice(observerIndex, 1);
        }
    }

    public notify(): void {
        console.log('notifying observers');
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    public setPrice(newPrice: number): void {
        console.log('product price changed to: ' + newPrice);
        this.price = newPrice;
        this.notify();
    }
}

class PriceDisplay implements Observer {
    private readonly elementId: string;

    constructor(elementId: string) {
        this.elementId = elementId;
    }

    update(subject: Subject): void {
        if (subject instanceof Product) {
            console.log(`PriceDisplay (${this.elementId}): Product price updated to ${subject.price}. Refreshing UI.`);
        }
    }
}

class EmailNotifier implements Observer {
    public update(subject: Subject): void {
        if (subject instanceof Product && subject.price < 50) {
            console.log(`EmailNotifier: Price dropped below $50 to ${subject.price}. Sending an email to interested users.`);
        }
    }
}

// -- USAGE -- 
const awesomeLaptop = new Product(55);

const display1 = new PriceDisplay('header-price');
const emailAlert = new EmailNotifier();

awesomeLaptop.attach(display1);
awesomeLaptop.attach(emailAlert);

awesomeLaptop.setPrice(45); // will trigger notifications
console.log('--- Display1 is no longer interested ---');
awesomeLaptop.detach(display1);

awesomeLaptop.setPrice(45);
