
// the receiver: it know how to perform the actions
class Light {
    constructor(private readonly location: string) { }

    public turnOn(): void {
        console.log(`${this.location} light is ON`);
    }

    public turnOff(): void {
        console.log(`${this.location} light is OFF`);
    }
}

interface Command {
    execute(): void;
}

// concrete commands
class LightOnCommand implements Command {
    constructor(private readonly light: Light) { }

    execute(): void {
        this.light.turnOn();
    }
}

class LightOffCommand implements Command {
    constructor(private readonly light: Light) { }

    execute(): void {
        this.light.turnOff();
    }
}

// the invoker
class SimpleRemoteControl {
    private slot!: Command;

    public setCommand(command: Command): void {
        this.slot = command;
    }

    public buttonWasPressed(): void {
        console.log('button pressed');
        if (this.slot) {
            this.slot.execute();
        } else {
            console.log('No command is set for this button');

        }
    }
}

// usage
const livingRoomLight = new Light("Living Room")
const turnOn = new LightOnCommand(livingRoomLight);
const turnOff = new LightOffCommand(livingRoomLight);

const remote = new SimpleRemoteControl();

remote.setCommand(turnOn);
remote.buttonWasPressed();

console.log("\n--- Reprogramming the remote ---");

remote.setCommand(turnOff)
remote.buttonWasPressed();