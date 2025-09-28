// the complex subsystem
class InventoryService {
    public checkStock(productId: string): boolean {
        console.log(`Checking stock for product ${productId}`);
        return true;
    }
}

class PaymentService {
    public processPayment(amount: number): boolean {
        console.log(`Processing payment of $${amount}`);
        return true;
    }
}

class ShippingService {
    public shipProduct(productId: string, address: string): void {
        console.log(`Shipping product ${productId} to ${address}`);
    }
}

// the FACADE
class OrderFacade {
    private inventory: InventoryService;
    private payment: PaymentService;
    private shipping: ShippingService;

    constructor() {
        this.inventory = new InventoryService();
        this.payment = new PaymentService();
        this.shipping = new ShippingService();
    }

    public placeOrder(productId: string, price: number, shippingAddress: string): boolean {
        console.log('--starting order--');
        if (!this.inventory.checkStock(productId)) {
            console.log('out of stock');
            return false;
        }
        if (!this.payment.processPayment(price)) {
            console.log('payment failed');
            return false;
        }
        this.shipping.shipProduct(productId, shippingAddress);
        console.log('order placed success!');
        return true;
    }
}

// --- Client Code ---
const orderSystem = new OrderFacade();
orderSystem.placeOrder("product-123", 99.99, "123 Main St, Anytown, USA");