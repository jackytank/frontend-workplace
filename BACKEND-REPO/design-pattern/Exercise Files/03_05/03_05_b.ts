// Component Interface 
abstract class Member {
    abstract printMemberInfo(): void;
}


// Leaf 
class TeamMember extends Member {
    name: string;
    teamNumber: number;
    position: string;

    constructor(name: string, teamNumber: number, position: string) {
        super();
        this.name = name;
        this.teamNumber = teamNumber;
        this.position = position;
    }

    printMemberInfo(): void {
        console.log("Name: %s Team Number: %d Position: %s\n",
            this.name, this.teamNumber, this.position);
    }

}



// Composite
class Roster extends Member {
    members: Member[] = [];
    name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }

    printMemberInfo(): void {
        console.log("Here's the roster for team: " + this.name);
        for (const element of this.members) {
            element.printMemberInfo();
        }
    }

    add(m: Member): void {
        this.members.push(m);
    }
}


function compositeClient() {
    const member1 = new TeamMember("Johnny Rocket", 12, "Forward");
    const member2 = new TeamMember("Tim Hoops", 24, 'Point Guard');
    const member3 = new TeamMember('Billy Banks', 29, "Shooting Guard");

    const roster = new Roster("Bobcats");
    roster.add(member1);
    roster.add(member2);
    roster.add(member3);

    roster.printMemberInfo();

}

compositeClient();
