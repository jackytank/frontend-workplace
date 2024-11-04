import { axiosClient } from "./axios-client";
import { ParamsUserPagi, UserPagiType } from "../types/global";

const USER_REQ = "/users";

export const userApi = {
    async getUsers({ page, perPage }: ParamsUserPagi): Promise<UserPagiType | undefined> {
        // simulate 1s delay
        
        const res = await axiosClient.get(`${USER_REQ}?_page=${page}&_per_page=${perPage}`);
        if (res.status !== 200) {
            return undefined;
        }
        return res.data;
    },
};