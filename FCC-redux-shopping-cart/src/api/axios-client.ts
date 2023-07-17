import axios, { AxiosError, AxiosResponse } from "axios";
import { toastError } from "../utils/toastify";

const REACT_APP_API_URL = 'http://localhost:3000/cartItems';

const axiosClient = axios.create({
    baseURL: REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const errorHandler = (error: AxiosError) => {
    if (error.response?.status === 500 || error.response?.status === 404) {
        toastError(`${error.response.data as string}`)
    }

};

axiosClient.interceptors.request.use((config) => {
    return config;
});

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        errorHandler(error);
    }
);

export default axiosClient;