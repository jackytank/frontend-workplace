import { User } from '../Main.Types';
import { Config } from "../Config";
import axiosClient from "./AxiosClient";

export const userApi = {
    getAll: (): Promise<User[]> => {
        return axiosClient.get(`${Config.API_PATH.USER}`);
    }
};