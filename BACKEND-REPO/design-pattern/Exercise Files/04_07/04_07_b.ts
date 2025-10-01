abstract class Car {

    abstract drive() : void 
    startEngine(): void {
        console.log("Starting Engine")
    }

    stopEngine(): void {
        console.log("Stoping Engine")
    }

    // template method 
    run() : void {

    }

}


class Sedan extends Car {

    drive() {
       
    }
}


class SUV extends Car {

    drive(){
       
    }
}



function templateMethodClient() {

    let sedan = new Sedan()
	sedan.run()

	let suv = new SUV()
	suv.run()
}

templateMethodClient()

