import { EmployeeModelApi } from "../routes/employee/employee.type";
import axiosClient from "./axios-client";

const todoApi = {
    getALl: () => {
        return axiosClient.get('/');
    },
    getOne: (id: number) => {
        return axiosClient.get(`/${id}`);
    },
    createOne: (data: EmployeeModelApi) => {
        return axiosClient.post(`/`, data);
    },
    updateOne: (id: number, data: EmployeeModelApi) => {
        return axiosClient.put(`/${id}`, data);
    },
    removeOne: (id: number) => {
        return axiosClient.delete(`/${id}`);
    },
};

export { todoApi };