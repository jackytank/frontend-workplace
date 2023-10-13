// @ts-check

let count = 0;

/**
 * 
 * @param {string | number} card 
 * @returns string
 */
function cc(card) {
    // Only change code below this line
    const plus1 = [2, 3, 4, 5, 6];
    const stay0 = [7, 8, 9];
    const minus1 = [10, 'J', 'Q', 'K', 'A'];

    if (stay0.includes(Number(card))) {
        count += 0;
    }
    if (plus1.includes(Number(card))) {
        ++count;
    }
    if (minus1.includes(card)) {
        --count;
    }
    const res = `${count} ${count <= 0 ? 'Hold' : 'Bet'}`;
    console.log(res);
    return res;
    // Only change code above this line
}

cc(7); cc(8); cc(9); cc('K'); cc('A');