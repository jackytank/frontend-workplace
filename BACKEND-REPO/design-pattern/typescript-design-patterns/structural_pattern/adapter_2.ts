// meaning: meaning sit in the middle and "translate" between two parties that have different expectation

// the old interface from a legacy system
interface OldUserInfo {
    username: string;
    userAge: number;
}

class LegacyUserSystem {
    // imagine this come from old API call response
    public getUser(): OldUserInfo {
        return {
            username: 'john_doe',
            userAge: 23
        };
    }
}

// the target interface that your new application uses
interface NewUserInfo {
    name: string;
    age: number;
    id: string;
}

class UserAdapter implements NewUserInfo {
    private adaptee: LegacyUserSystem;
    public id: string;

    constructor(adaptee: LegacyUserSystem) {
        this.adaptee = adaptee;
        this.id = crypto.randomUUID();
    }

    get name(): string {
        return this.adaptee.getUser().username;
    }

    get age(): number {
        return this.adaptee.getUser().userAge;
    }
}

// -- clien code --
function displayUser(user: NewUserInfo) {
    console.log(`User ID: ${user.id}, Name: ${user.name}, Age: ${user.age}`);
}

const legacySystem = new LegacyUserSystem();
const adaptedUser = new UserAdapter(legacySystem);

displayUser(adaptedUser)