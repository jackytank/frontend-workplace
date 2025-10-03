// Let's model a simple data processing pipeline. The overall process (read, process, save) is fixed, but the data source (CSV, JSON) can vary.

// The Abstract Class defines the template method and the abstract steps.
abstract class DataProcessor {

    // This is the TEMPLATE METHOD. It's final (or not overridable)
    // and defines the skeleton of the algorithm.
    public process(): void {
        this.readData();
        this.parseData();
        this.analyzeData(); // A "hook" method that's optional
        this.saveData();
        console.log("Processing complete.");
    }

    // These are the abstract steps that subclasses MUST implement.
    protected abstract readData(): void;
    protected abstract parseData(): void;

    // This is a concrete method, common for all subclasses.
    protected saveData(): void {
        console.log('Saving processed data to the database');
    }

    // This is a "hook". It's a method with a default (but empty) implementation.
    // Subclasses can optionally override it.
    protected analyzeData(): void { }
}

// concrete classes

class CsvDataProcessor extends DataProcessor {
    protected readData(): void {
        console.log('reading data from a csv file');
    }

    protected parseData(): void {
        console.log('parsing csv data');
    }

    protected analyzeData(): void {
        console.log('analyzing csv specific metrics');
    }
}

class JsonDataProcessor extends DataProcessor {
    protected readData(): void {
        console.log('reading data from a JSON file');
    }

    protected parseData(): void {
        console.log('parsing JSON data');
    }
}

// client code
console.log("--- Processing a CSV file ---");
const csvProcessor = new CsvDataProcessor();
csvProcessor.process();

console.log("\n--- Processing a JSON file ---");
const jsonProcessor = new JsonDataProcessor();
jsonProcessor.process();
