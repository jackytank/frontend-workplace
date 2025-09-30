// TypeScript Example: Document Publishing Workflow
// Let's model a document that can be a Draft, in Moderation, or Published. Its behavior (e.g., what happens when you call publish()) depends entirely on its current state.

class MyDocument {
    private state: State;
    public content: string = '';

    constructor() {
        this.state = new DraftState(this);
    }

    public transitionTo(state: State): void {
        console.log(`Context: Transitioning to ${state.constructor.name}.`);
        this.state = state;
    }

    public publish(): void {
        this.state.publish();
    }

    public review(): void {
        this.state.review();
    }
}

interface State {
    publish(): void;
    review(): void;
}

class DraftState implements State {
    constructor(private readonly document: MyDocument) { }

    public review(): void {
        console.log('content sent for review');
        this.document.transitionTo(new ModerationState(this.document));
    }

    publish(): void {
        console.log("Cannot publish from Draft state. Must be reviewed first.");
    }
}

class ModerationState implements State {
    constructor(private document: MyDocument) { }

    review(): void {
        console.log('document is already under review');
    }

    public publish(): void {
        console.log('document approved and published');
        this.document.transitionTo(new PublishedState(this.document));
    }
}

class PublishedState implements State {
    constructor(private document: MyDocument) { }

    review(): void {
        console.log('cannot review a published document.');
    }

    publish(): void {
        console.log('document is already published');
    }
}

// client code
const myDoc = new MyDocument();
myDoc.content = 'my super vjp pr0 post!';

console.log("--- Initial State: Draft ---");
myDoc.publish(); // which fails
myDoc.review(); // to moderation

console.log("\n--- State: Moderation ---");
myDoc.publish();

console.log("\n--- State: Published ---");
myDoc.publish();// do nothing
myDoc.review();// do nothing