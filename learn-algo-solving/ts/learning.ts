import { Fish, Bird } from "./types";

const LearnBasic = () => {
    const isPet = (pet: Fish | Bird): pet is Fish => {
        return (pet as Fish).name !== undefined;
    };
    const testPet: Fish | Bird = {} as Fish | Bird;
    if (isPet(testPet)) {
        console.log('is fish');
    } else {
        console.log('is Bird');
    }

};

// main 
(() => {
    LearnBasic();
})();