//@ts-check

/**
 * @callback testCallBackFuncCallBack
 * @param {string} firstStr
 * @param {string} secondStr
 * @returns {string}
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} email
 * @property {Array<number>} postLikes
 * @property {string[]} friends
 * @property {number=} age
 */

/** @type {Array<User>}*/
export const users = [
    {
        id: 23,
        username: "Elijah",
        email: "elijah@user.com",
        postLikes: [44, 22, 24, 39],
        friends: ['fede', 'Elijah'],
    },
    {
        id: 3,
        username: "Shit",
        email: "elijah@user.com",
        postLikes: [44, 22, 24, 39],
        friends: ['fede', 'Elijah'],
    },
    {
        id: 233,
        username: "What",
        email: "elijah@user.com",
        postLikes: [44, 22, 24, 39],
        friends: ['fede', 'Elijah'],
    },
    {
        id: 12,
        username: "Jack",
        email: "elijah@user.com",
        postLikes: [44, 22, 24, 39],
        friends: ['fede', 'Elijah'],
    },
    {
        id: 223,
        username: "Jenny",
        email: "elijah@user.com",
        postLikes: [44, 22, 24, 39],
        friends: ['fede', 'Elijah'],
    },
];