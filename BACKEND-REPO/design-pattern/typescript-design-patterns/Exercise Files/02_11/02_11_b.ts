class Database {
    private static instance: Database;

    private constructor() {
    }

    public static getInstance(): Database {
 
    }
}

// Usage
function singletonClient() {
	for (let i = 0; i < 5; i++ ){
        Database.getInstance()
    }
}

singletonClient()
