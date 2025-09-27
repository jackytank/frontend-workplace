class Singleton {
    private static instance: Singleton;
    private constructor() { } // prevent external instantionation

    static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton;
        }
        return Singleton.instance;
    }

    public doSomething() {
        console.log("Singleton doing its things!");
    }
}

const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();

// check if 2 instnace are same instnace
console.log(s1 === s2); // true
