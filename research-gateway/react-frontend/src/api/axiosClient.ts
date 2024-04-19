import axios, { AxiosError, AxiosResponse } from "axios";
import { constants } from "../constants/constants";
import { store } from "../redux/store";
import { setLoading } from "../redux/slice/common-slice";

export const axiosClient = axios.create({
    baseURL: constants.API.HOST_AND_PORT,
    headers: {
        'Content-Type': constants.CONTENT_TYPE.XML,
    },
});

// request interceptors for future JWT authentication or something else...
axiosClient.interceptors.request.use(
    (config) => {
        store.dispatch(setLoading(true));
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// response interceptors, we can use this to handle error globally
// or set loading spinner state globally
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        store.dispatch(setLoading(false));
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
