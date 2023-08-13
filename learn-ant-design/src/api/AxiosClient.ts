import axios, { AxiosError, AxiosResponse } from "axios";
import { toastError } from "../utils/toastify";
import { setLoading } from "../features/common/CommonSlice";
import { store } from "../Store";
import { Config } from "../Config";

const axiosClient = axios.create({
    baseURL: Config.REACT_APP_API_URL,
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
            resolve(config);
            // setTimeout(() => {
            //     resolve(config);
            // }, 500);
        });
    },
    (error) => {
        store.dispatch(setLoading(false));
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        store.dispatch(setLoading(false));
        return response;
    },
    (error: AxiosError) => {
        store.dispatch(setLoading(false));
        errorHandler(error);
    }
);

export default axiosClient;