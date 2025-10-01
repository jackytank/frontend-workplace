// meaning: create new objects by copying an existing object, known as the "prototype"
// problem: creating an object is expensive (it require a database call, a network request, or complex calculations)
// its more efficient to create one instance and then clone it whenever you need a new one
// solution: define a clone() method on a base class or interface. When you need a new object, you call clone()
// on an existing "prototype" instance instead of using the new keyword.

abstract class Shape {
    public x: number;
    public y: number;
    public color: string;

    constructor(source?: Shape) {
        this.x = source?.x ?? 0;
        this.y = source?.y ?? 0;
        this.color = source?.color ?? "black";
    }

    public abstract clone(): Shape;
}

class Rectangle extends Shape {
    public width: number;
    public height: number;

    constructor(source?: Rectangle) {
        super(source);
        this.width = source?.width ?? 0;
        this.height = source?.height ?? 0;
    }

    public clone(): Shape {
        return new Rectangle(this);
    }
}

class Circle extends Shape {
    public radius: number;

    constructor(source?: Circle) {
        super(source);
        this.radius = source?.radius ?? 0;
    }

    public clone(): Shape {
        return new Circle(this);
    }
}

// client
const originalRect = new Rectangle();
originalRect.width = 100;
originalRect.height = 50;
originalRect.color = "blue";

const originalCircle = new Circle();
originalCircle.radius = 30;
originalCircle.color = 'red';

const clonedRect = originalRect.clone() as Rectangle;
const clonedCircle = originalCircle.clone() as Circle;

clonedRect.color = 'green'
clonedRect.x = 20;

console.log("Original Rectangle:", originalRect);
console.log("Cloned Rectangle:", clonedRect);

console.log("\nOriginal Circle:", originalCircle);
console.log("Cloned Circle:", clonedCircle);