export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isOdd = (num: number) => {
    return num % 2 !== 0;
};

export const isEven = (num: number) => {
    return num % 2 === 0;
};