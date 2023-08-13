import { Config } from "../Config";
import { EmployeeModelApi } from "../routes/employee/EmployeeReturnCols";
import axiosClient from "./AxiosClient";

const employeeApi = {
    getAll: () => {
        return axiosClient.get(Config.API_PATH.EMPLOYEE);
    },
    getOne: (id: number) => {
        return axiosClient.get(`${Config.API_PATH.EMPLOYEE}/${id}`);
    },
    createOne: (data: EmployeeModelApi) => {
        return axiosClient.post(Config.API_PATH.EMPLOYEE, data);
    },
    updateOne: (id: number, data: EmployeeModelApi) => {
        return axiosClient.put(`${Config.API_PATH.EMPLOYEE}/${id}`, data);
    },
    removeOne: (id: number) => {
        return axiosClient.delete(`${Config.API_PATH.EMPLOYEE}/${id}`);
    },
};

export { employeeApi };