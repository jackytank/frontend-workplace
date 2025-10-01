// Legacy third-party service (incompatible interface)
class ThirdPartyService {
    specificRequest(): string {
        return "Adaptee's legacy response";
    }
}

interface Target {
    request(): string;
}

// Adapter bridge the gap
class Adapter implements Target {
    private adaptee: ThirdPartyService;

    constructor(adaptee: ThirdPartyService) {
        this.adaptee = adaptee;
    }

    request(): string {
        return `Adapter: ${this.adaptee.specificRequest()}`;
    }
}

// Usage
const servie = new ThirdPartyService();
const adapter = new Adapter(servie);
console.log(adapter.request());
