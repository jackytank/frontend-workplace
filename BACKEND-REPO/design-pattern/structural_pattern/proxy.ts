// example: a credit card is a proxy for my bank account, I can use the card
// for purchase shits and the card handle communication with the bank, it can
// also add it own logic like fraud checks or spending limits
// problem: I want to control access to another object. this control could be for security
// or performance or to handle expensive resource inititzation

interface DocumentRepository {
    readDocument(docId: string): string;
    deleteDocument(docId: string): void;
}

// the real subject
class RealDocumentRepository implements DocumentRepository {
    public readDocument(docId: string): string {
        console.log(`[DB] Fetching document '${docId}' from the database.`);
        return `This is the content of document ${docId}.`;
    }

    public deleteDocument(docId: string): void {
        console.log(`[DB] Deleting document '${docId}' from the database.`);
    }
}

type User = {
    name: string;
    role: 'user' | 'admin';
};

class SecureDocumentRepositoryProxy implements DocumentRepository {
    private realRepository: DocumentRepository;
    private currentUser: User;
    constructor(repository: DocumentRepository, user: User) {
        this.realRepository = repository;
        this.currentUser = user;
    }

    readDocument(docId: string): string {
        return this.realRepository.readDocument(docId);
    }

    deleteDocument(docId: string): void {
        if (this.currentUser.role !== 'admin') {
            throw new Error(`Access Denied: User '${this.currentUser.name}' does not have permission to delete documents.`);
        }
        console.log(`[AUDIT] User '${this.currentUser.name}' is deleting document '${docId}'.`);
        this.realRepository.deleteDocument(docId);
    }
}

// --- Client Code ---
const adminUser: User = { name: "Alice", role: "admin" };
const regularUser: User = { name: "Bob", role: "user" };

function clientApp(repository: DocumentRepository) {
    try {
        console.log("Attempting to read document...");
        const content = repository.readDocument("report-q1.pdf");
        console.log("Read successful:", content);

        console.log("\nAttempting to delete document...");
        repository.deleteDocument("report-q1.pdf");
        console.log("Delete successful.");
    } catch (error) {
        console.error((error as Error).message);
    }
}

const realRepo = new RealDocumentRepository();
const bobsRepository = new SecureDocumentRepositoryProxy(realRepo, regularUser);
clientApp(bobsRepository);

console.log("\n------------------------------------------\n");

console.log("--- Running app for ADMIN USER (Alice) ---");
// We wrap the SAME real repository in a DIFFERENT security proxy for Alice.
const alicesRepository = new SecureDocumentRepositoryProxy(realRepo, adminUser);
clientApp(alicesRepository);
