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


 }
 
 compositeClient()
 