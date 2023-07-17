import { ICartItem } from "../features/cart/cartSlice";
import axiosClient from "./axios-client";

const cartApi = {
    getALl: () => {
        return axiosClient.get('/');
    },
    getOne: (id: number) => {
        return axiosClient.get(`/${id}`);
    },
    createOne: (data: ICartItem) => {
        return axiosClient.post(`/`, data);
    },
    updateOne: (id: number, data: ICartItem) => {
        return axiosClient.put(`/${id}`, data);
    },
    removeOne: (id: number) => {
        return axiosClient.delete(`/${id}`);
    },
};

export { cartApi };