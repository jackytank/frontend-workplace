export const constants = {
    ROUTING: {
        INDEX: '/',
        HOME: '/home',
        ANALYSIS: '/analysis'
    },
    CONTENT_TYPE: {
        JSON: 'application/json',
        XML: 'text/xml',
    },
    API: {
        HOST_AND_PORT: import.meta.env.VITE_HOST_URL as string,
        API_V1_PATH: import.meta.env.VITE_API_V1_PATH as string,
        WS_PATH: import.meta.env.VITE_WS_PATH as string,
    }
};