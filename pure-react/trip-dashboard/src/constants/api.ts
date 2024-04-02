export const API_PATH: { [key: string]: string; } = {
    GET_TRIPS: '/trips',
    CREATE_TRIP: '/trips',
};

export const RESPONSE_CODE: { [key: string]: number; } = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    SYSTEM_ERROR: 500
};
