// purpose: Define an interface for creating objects, but let subclasses decide which class
// to instantiate
// when to use: When you need to create objects without specifying exact classes 


interface Pizza {
    prepare(): void;
    bake(): void;
    cut(): void;
    box(): void;
}

class NYStyleCheesePizza implements Pizza {
    prepare = () => console.log("Preparing NY Style Pizza with thin crust...");
    bake = () => console.log("Baking at high temperature...");
    cut = () => console.log("Cutting into triangular slices...");
    box = () => console.log("Placing in a generic pizza box...");
}

class ChicagoStyleDeepDishPizza implements Pizza {
    prepare = () => console.log("Preparing Chicago Style Pizza with deep dish crust...");
    bake = () => console.log("Baking slowly in a pan...");
    cut = () => console.log("Cutting into square slices...");
    box = () => console.log("Placing in a tall, sturdy box...");
}

abstract class PizzaStore {
    protected abstract createPizza(type: string): Pizza;

    public orderPizza(type: string): Pizza {
        const pizza = this.createPizza(type);
        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.box();
        return pizza;
    }
}

class NYPizzaStore extends PizzaStore {
    protected createPizza(type: string): Pizza {
        if (type == 'cheese') {
            return new NYStyleCheesePizza();
        }
        throw new Error("invalid pizza type for this store");
    }
}

class ChicagoPizzaStore extends PizzaStore {
    protected createPizza(type: string): Pizza {
        if (type === 'deep_dish') {
            return new ChicagoStyleDeepDishPizza();
        }

        throw new Error("Invalid pizza type for this store");
    }
}

console.log('Factory method pattern');
const myStore = new NYPizzaStore();
myStore.orderPizza('cheese');

console.log();


const chicagoStore = new ChicagoPizzaStore();
chicagoStore.orderPizza('deep_dish');
