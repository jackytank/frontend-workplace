// Component Interface 
abstract class Member  {
    abstract printMemberInfo() : void
}
 

 // Leaf 
class TeamMember extends Member {
    name : string
    teamNumber: number 
    position : string 

    constructor(name: string, teamNumber: number, position: string) {
        super()
        this.name = name
        this.teamNumber = teamNumber
        this.position = position
    }

    printMemberInfo(): void {
        console.log("Name: %s Team Number: %d Position: %s\n", 
        this.name, this.teamNumber, this.position)
    }

}
 
 

// Composite
 class Roster extends Member {
     members : Member[] = []
     name : string 
 
     constructor(name: string) {
         super()
         this.name = name
     }
 
    printMemberInfo(): void {
        console.log("Here's the roster for team: " + this.name)
        for(let i = 0; i < this.members.length; i++) {
            this.members[i].printMemberInfo()
        }
    }
 
     add(m : Member) : void{
         this.members.push(m)
     }
 }
 

 function compositeClient() {
     // Initialize our team members
     let member1 = new TeamMember("Johnny Rocket", 12, "Forward")
     let member2 = new TeamMember("Tim Hoops", 24, "Point Guard")
     let member3 = new TeamMember("Billy Banks", 29, "Shooting Guard")
 
     // Initialize our roster 
     let roster = new Roster("Bobcats")
 
     // Add team members to our roster 
     roster.add(member1)
     roster.add(member2)
     roster.add(member3)
 
     // print out the member info
     roster.printMemberInfo()
 }
 
 compositeClient()
 