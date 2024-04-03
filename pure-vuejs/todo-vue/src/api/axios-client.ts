import axios from "axios";
import { useCommonStore } from "../store/common-store";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_VUE_APP_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Request interceptor
axiosClient.interceptors.request.use(
    (config) => {
        const commonStore = useCommonStore();
        commonStore.setLoading(true); // Set isLoading to true before the request is sent
        return config;
    },
    (error) => {
        const commonStore = useCommonStore();
        commonStore.setLoading(false); // Set isLoading to false if there's an error before the request is sent
        return Promise.reject(error);
    }
);

// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        const commonStore = useCommonStore();
        commonStore.setLoading(false); // Set isLoading to false after the response is received
        return response;
    },
    (error) => {
        const commonStore = useCommonStore();
        commonStore.setLoading(false); // Set isLoading to false also when there's an error after the response is received
        return Promise.reject(error);
    }
);