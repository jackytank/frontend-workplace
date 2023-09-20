import { Config } from "../Config";
import { EmployeeModelApi, EmployeeSearchFormType } from "../routes/employee/Employee.Types";
import axiosClient from "./AxiosClient";

const employeeApi = {
    getAll: (
        { search, name, email, status }: EmployeeSearchFormType
    ) => {
        const filteredParams = Object.fromEntries(Object.entries({ search, name, email, status }).filter(([, value]) => value !== undefined && value !== null));
        const queryString = new URLSearchParams(filteredParams as unknown as string).toString();
        return axiosClient.get(
            Config.API_PATH.EMPLOYEE + (queryString ? `?${queryString}` : "")
        );
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