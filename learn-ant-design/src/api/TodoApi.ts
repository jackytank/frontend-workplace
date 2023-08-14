import { EmployeeModelApi } from "../routes/employee/Employee.Types";
import axiosClient from "./AxiosClient";

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