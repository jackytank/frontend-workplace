// meaning: provides an interface for creating families of related or 
// dependent objects without specifying their concrete classes this is a factory of factories

interface IChair {
    sitOn(): void;
}

interface ISofa {
    lieOn(): void;
}

// modern
class ModernChair implements IChair {
    sitOn(): void {
        console.log("Sitting on a modern chair");
    }
}

class ModernSofa implements ISofa {
    lieOn(): void {
        console.log("Lying on a modern sofa");
    }
}

// victorian
class VictorianChair implements IChair {
    sitOn(): void {
        console.log("Sitting on a Victorian chair");
    }
}

class VictorianSofa implements ISofa {
    lieOn(): void {
        console.log("Lying on a Victorian sofa");
    }
}

interface IFurnitureFactory {
    createChair(): IChair;
    createSofa(): ISofa;
}

class ModernFurnitureFactory implements IFurnitureFactory {
    createChair(): IChair {
        return new ModernChair();
    }

    createSofa(): ISofa {
        return new ModernSofa();
    }
}

class VictorianFurnitureFactory implements IFurnitureFactory {
    createChair(): IChair {
        return new VictorianChair();
    }
    createSofa(): ISofa {
        return new VictorianSofa();
    }
}

// client
function createFurnitureSet(factory: IFurnitureFactory) {
    const chair = factory.createChair();
    const sofa = factory.createSofa();
    chair.sitOn();
    sofa.lieOn();
}

console.log("Client wants a modern set:");
createFurnitureSet(new ModernFurnitureFactory());

console.log("\nClient wants a victorian set:");
createFurnitureSet(new VictorianFurnitureFactory());