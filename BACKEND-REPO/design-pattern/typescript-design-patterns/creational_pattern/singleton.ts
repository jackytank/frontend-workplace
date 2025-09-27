class DatabaseConnection {
    private static instance: DatabaseConnection;
    private connectionId: number;

    private constructor() { // prevent outside direct instantiation
        this.connectionId = Math.random() * 1000;
        console.log("Database connected. Connection ID: " + this.connectionId);
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public query(sql: string): void {
        console.log(`Executing query "${sql}" with connection ID: ${this.connectionId}`);
        
    }
}

console.log('---SIngleton Pattern---');

const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();

console.log('Are both instances the same?', db1 === db2); // true
db1.query("SELECT * FROM users"); // Both
db2.query("SELECT * FROM products"); // will use the same connection

