// TypeScript Example: Chat Room;
// A chat room is a classic example. Users don't send messages directly to other users. They send a message to the chat room (Mediator), which then broadcasts it to everyone else.

interface ChatMediator {
    sendMessage(message: string, user: User): void;
}

class User {
    constructor(public name: string, private mediator: ChatMediator) { }

    public send(message: string): void {
        console.log(`${this.name} sends: ${message}`);
        this.mediator.sendMessage(message, this);
    }

    public receive(message: string, from: User): void {
        console.log(`${this.name} received from ${from.name}: ${message}`);
    }
}

// concrete mediator implements the communication logic
class ChatRoom implements ChatMediator {
    private users: User[] = [];

    public addUser(user: User): void {
        this.users.push(user);
    }

    sendMessage(message: string, sender: User): void {
        for (const user of this.users) {
            // send dont receive their own msg back
            if (user !== sender) {
                user.receive(message, sender);
            }
        }
    }
}

const chatRoom = new ChatRoom();

const user1 = new User("Alice", chatRoom);
const user2 = new User("Bob", chatRoom);
const user3 = new User("Charlie", chatRoom);

chatRoom.addUser(user1);
chatRoom.addUser(user2);
chatRoom.addUser(user3);

user1.send("Hi everyone!");
console.log("\n");

user2.send("Hello Alice!");