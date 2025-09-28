interface OrderItem {
    getPrice(): number;
    getName(): string;
}

class Product implements OrderItem {
    private name: string;
    private price: number;
    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }

    public getName(): string {
        return this.name;
    }

    public getPrice(): number {
        console.log(`- Calculating price for product: ${this.name} ($${this.price})`);
        return this.price;
    }
}

// the COMPOSITE
class Box implements OrderItem {
    private name: string;
    private children: OrderItem[] = [];

    constructor(name: string) {
        this.name = name;
    }

    public getName(): string {
        return this.name;
    }

    public add(item: OrderItem): void {
        this.children.push(item);
    }

    public remove(item: OrderItem): void {
        const index = this.children.indexOf(item);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    // The magic of the pattern is here.
    // To get the price of a box, we recursively ask each child for its price.
    public getPrice(): number {
        console.log(`\nCalculating total for box: "${this.name}"`);
        const total = this.children.reduce(
            (sum, child) => sum + child.getPrice(),
            0
        );
        console.log(`> Total for box "${this.name}" is $${total}`);
        return total;
    }
}

// --- Client Code ---
const phone = new Product("Smartphone", 800);
const headphones = new Product("Noise-Cancelling Headphones", 250);
const charger = new Product("USB-C Charger", 25);

// Create a composite box
const phoneGiftBox = new Box("Smartphone Essentials Gift Box");
phoneGiftBox.add(phone);
phoneGiftBox.add(charger);

// Create a larger order that contains both individual items and boxes
const customerOrder = new Box("John Doe's Full Order");
customerOrder.add(headphones);
customerOrder.add(phoneGiftBox); // <-- Adding a box inside another box

// Calculate the total price of the entire order
console.log("\n==================================");
console.log("CALCULATING TOTAL ORDER PRICE");
const totalCost = customerOrder.getPrice();
console.log("==================================");
console.log(`\nFinal total for the entire order: $${totalCost}`);