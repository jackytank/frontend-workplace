// Iterator Interface
abstract class AbstractIterator {
    abstract next(): TeamMember;
    abstract hasNext(): boolean;
}

// Collection Iterface
abstract class Aggregator {
    abstract getIterator(): AbstractIterator
 }


class TeamMember  {
    name : string
    teamNumber: number 
    position : string 

    constructor(name: string, teamNumber: number, position: string) {
        this.name = name
        this.teamNumber = teamNumber
        this.position = position
    }

    printMemberInfo(): void {
        console.log("Name: %s Team Number: %d Position: %s\n", this.name, this.teamNumber, this.position)
    }

 }


 // Concrete Iterator
 class TeamMemberIterator extends AbstractIterator {

    teamMembers : TeamMember[]
    index : number = 0

    constructor(teamMembers : TeamMember[] ){
        super()
        this.teamMembers = teamMembers
    }

    hasNext(): boolean {
        
    }

    next(): TeamMember{
       
    }
 }

 // Concrete Collection
 class Roster extends Aggregator {
    teamMembers : TeamMember[] 

    constructor(teamMembers : TeamMember[]) {
        super()
        this.teamMembers = teamMembers
    }

    getIterator(): TeamMemberIterator {
      
    }
 }

 // Client
 function iteratorClient() {
    let member1 = new TeamMember("Johnny Rocket", 12, "Forward")
	let member2 = new TeamMember("Tim Hoops", 24, "Point Guard")
    let member3 = new TeamMember("Billy Banks", 29, "Shooting Guard")

    let roster = new Roster([member1, member2, member3])
    let iterator = roster.getIterator()

    while(iterator.hasNext()) {
        iterator.next().printMemberInfo()
    }
    
 }

 iteratorClient()

