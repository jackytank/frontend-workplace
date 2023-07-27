import axios, { AxiosError, AxiosResponse } from "axios";
import { toastError } from "../utils/toastify";
import { setLoading } from "../features/common/CommonSlice";
import { store } from "../Store";

const REACT_APP_API_URL = 'http://localhost:3000/api/v1/employees';

const axiosClient = axios.create({
    baseURL: REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

const errorHandler = (error: AxiosError) => {
    if (error.response?.status === 500 || error.response?.status === 404) {
        toastError(`${error.response.data as string}`);
    }

};

axiosClient.interceptors.request.use(
    (config) => {
        return new Promise((resolve) => {
            store.dispatch(setLoading(true));
            // simulate latency
            setTimeout(() => {
                resolve(config);
            }, 750);
        });
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        store.dispatch(setLoading(false));
        return response;
    },
    (error: AxiosError) => {
        errorHandler(error);
    }
);

export default axiosClient;