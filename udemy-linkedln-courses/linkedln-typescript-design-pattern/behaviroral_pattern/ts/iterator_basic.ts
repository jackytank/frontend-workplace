// basic iterator pattern

interface MyIterator<T> {
    hasNext(): boolean;
    next(): T;
}

interface IterableCollection<T> {
    createIterator(): MyIterator<T>;
}

class ArrayIterator<T> implements MyIterator<T> {
    private index = 0;

    constructor(private collection: T[]) { }

    hasNext(): boolean {
        return this.index < this.collection.length;
    }

    next(): T {
        if (!this.hasNext()) {
            throw new Error('No more elements');
        }
        return this.collection[this.index++];
    }
}

class NumberCollection implements IterableCollection<number> {
    constructor(private numbers: number[]) { }

    createIterator(): MyIterator<number> {
        return new ArrayIterator(this.numbers);
    }

    add(number: number): void {
        this.numbers.push(number);
    }
}

// usage
const collection = new NumberCollection([1, 2, 3, 4, 5]);
const iterator = collection.createIterator();
while (iterator.hasNext()) {
    console.log(iterator.next());
}