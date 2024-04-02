import { User } from '../main.type';
import { Config } from "../config";
import axiosClient from "./axios-client";

export const userApi = {
    getAll: (): Promise<User[]> => {
        return axiosClient.get(`${Config.API_PATH.USER}`);
    }
};