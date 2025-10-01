// Product Interfaces
abstract class Chair {
    abstract sitOn(): void;
}

abstract class Table {
    abstract eatOn(): void;
}

// Concrete Products
class ModernChair extends Chair {
    sitOn(): void {
        console.log("Sitting on a modern chair.");
    }
}

class ModernTable extends Table {
    eatOn(): void {
        console.log("Eating on a modern table.");
    }
}

class VictorianChair extends Chair {
    sitOn(): void {
        console.log("Sitting on a victorian chair.");
    }
}

class VictorianTable extends Table {
    eatOn(): void {
        console.log("Eating on a victorian table.");
    }
}


// Abstract Factory
abstract class FurnitureFactory {
    abstract createChair(): Chair;
    abstract createTable(): Table;
}


// Concrete Factories
class ModernFurnitureFactory extends FurnitureFactory {
    createChair(): Chair {
        return new ModernChair();
    }
    createTable(): Table {
        return new ModernTable();
    }
}

class VictorianFurnitureFactory extends FurnitureFactory {
    createChair(): Chair {
        return new VictorianChair();
    }
    createTable(): Table {
        return new VictorianTable();
    }
}

// Implement the Abstract Factory

function furnitureClient(factory: FurnitureFactory) {
    const chair = factory.createChair();
    const table = factory.createTable();
    chair.sitOn();
    table.eatOn();
}

// Create modern furniture
furnitureClient(new ModernFurnitureFactory());

// Create victorian furniture
furnitureClient(new VictorianFurnitureFactory());