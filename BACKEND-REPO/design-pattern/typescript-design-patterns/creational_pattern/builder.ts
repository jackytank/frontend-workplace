class Computer {
    public cpu?: string;
    public ram?: number;
    public storage?: number;
    public gpu?: string;

    public display(): void {
        console.log("Computer specs:", this);
    }
}

interface IComputerBuilder {
    setCPU(cpu: string): this;
    setRAM(ram: number): this;
    setStorage(storage: number): this;
    setGPU(gpu: string): this;
    build(): Computer;
}

class ComputerBuilder implements IComputerBuilder {
    private computer: Computer;

    constructor() {
        this.computer = new Computer();
    }

    setCPU(cpu: string): this {
        this.computer.cpu = cpu;
        return this;
    }

    setGPU(gpu: string): this {
        this.computer.gpu = gpu;
        return this;
    }

    setRAM(ram: number): this {
        this.computer.ram = ram;
        return this;
    }

    setStorage(storage: number): this {
        this.computer.storage = storage;
        return this;
    }

    build(): Computer {
        const result = this.computer;
        this.computer = new Computer();
        return result;
    }
}

// client
const builder = new ComputerBuilder();

const gamingPC = builder.setCPU("AMD R5")
    .setRAM(32)
    .setStorage(2000)
    .setGPU("RTX 4090")
    .build();

console.log("gaming pc build:");
gamingPC.display();

const officePC = builder.setCPU("Intel I3")
    .setRAM(4)
    .setGPU("Intel HD Graphics")
    .setStorage(500)
    .build();

console.log("office pc build:");
officePC.display();


