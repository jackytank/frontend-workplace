import { EmployeeModelApi } from "../routes/employee/EmployeeReturnCols";
import axiosClient from "./AxiosClient";

const employeeApi = {
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

export { employeeApi };