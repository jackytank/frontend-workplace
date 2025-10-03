// analogy: just like pizza start with base pizza then add shits or "decorate"
// it with stuffs like shits, mushrooms, pepperoni,...etc without
// changing the base pizza itself
// Example: you have a NotificationService. u want to add
// SMS and Slack functionality to it without changing the original class

interface Notifier {
    send(message: string): void;
}

class NotificationService implements Notifier {
    send(message: string): void {
        console.log(`[EMAIL] Sending notification: "${message}"`);
    }
}

// The base DECORATOR class
abstract class NotifierDecorator implements Notifier {

    protected wrapped: Notifier;

    constructor(notifier: Notifier) {
        this.wrapped = notifier;
    }

    send(message: string): void {
        this.wrapped.send(message);
    }
}

// CONCRETE DECORATORS
class SMSDecorator extends NotifierDecorator {
    send(message: string): void {
        super.send(message);
        console.log(`[SMS] Sending notification: "${message}"`);
    }
}

class SlackDecorator extends NotifierDecorator {
    send(message: string): void {
        super.send(message);
        console.log(`[SLACK] Sending notification: "${message}"`);
    }
}

// -- client code -- 
let notifier: Notifier = new NotificationService();
notifier.send('your order had shipped')

console.log("\n--- Adding SMS ---");
notifier = new SMSDecorator(notifier);
notifier.send('Your package is out for delivery')

console.log("\n--- Adding Slack as well ---");
notifier = new SlackDecorator(notifier);
notifier.send("Your package has been delivered.");