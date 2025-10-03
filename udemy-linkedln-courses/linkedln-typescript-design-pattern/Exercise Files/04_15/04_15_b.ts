
// Object Interface
abstract class Animal {
    abstract makeSound(): string;
}

// Concrete Object 1
class Cat extends Animal {

    makeSound(): string {
        return "Meow";
    }
}


// Concrete Object 2
class Dog extends Animal {

    makeSound(): string {
        return "Woof";
    }
}



// Strategy Interface
abstract class Strategy {

    abstract execute(): string;
}


// Concrete Strategy A
class SpeakStrategy extends Strategy {
    animal: Animal;

    constructor(animal: Animal) {
        super();
        this.animal = animal;
    }

    execute(): string {
        return this.animal.makeSound();
    }
}

// Concrete Strategy B
class BarkStrategy extends Strategy {
    animal: Animal;

    constructor(animal: Animal) {
        super();
        this.animal = animal;
    }

    execute(): string {
        return this.animal.makeSound();
    }
}



// Context  
class Context {
    strategy: Strategy;

    constructor(strategy: Strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    executeStrategy(): string {
        return this.strategy.execute();
    }
}



// Client 
function strategyClient() {
    const cat = new Cat();
    const dog = new Dog();

    const speakStrategy = new SpeakStrategy(cat);
    const barkStrategy = new BarkStrategy(dog);

    const context = new Context(speakStrategy);
    console.log(context.executeStrategy());
    context.setStrategy(barkStrategy)
    console.log(context.executeStrategy());
}

strategyClient();