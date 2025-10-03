//@ts-check
import { users } from "./utils";

/**
 * 
 * @param {import("./utils").testCallBackFuncCallBack} myFunc 
 * @returns {string}
 */
const testCallBackFunc = (myFunc) => {
    /**@type {string} */
    const res = myFunc('3', '23');
    return res;
};

const userService = {
    /**
     * @param {string} keyword 
     * @param {number} no 
     * @param {number} limit 
     * @param {boolean} [desc=false] desc
     * @returns {Array<import("./utils").User>}
     */
    getAll: (keyword, no, limit, desc = false) => {
        /**@type {import("./utils").User} */
        const person1 = {
            id: 23,
            username: "Elijah",
            email: "elijah@user.com",
            postLikes: [44, 22, 24, 39],
            friends: ['fede', 'Elijah'],
        };
        return [person1];
    },
    /**
     * 
     * @param {import("./utils").User} user 
     * @returns {void}
     */
    deleteOne: (user) => {
        users.filter(e => e.id === user.id);
    }
};