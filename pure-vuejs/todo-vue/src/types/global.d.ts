export type UserPagiType = {
    first: number;
    prev: number;
    next: number;
    last: number;
    pages: number;
    items: number;
    data: UserType[];
};

export type UserType = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    };
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    };
};

export type ParamsUserPagi = {
    page?: number;
    perPage?: number;
};

export type TodoType = {
    done: boolean,
    content: string;
};