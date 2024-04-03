import { defineStore } from "pinia";
import { ParamsUserPagi, UserPagiType } from "../types/global";
import { userApi } from "../api/user-api";

export type UserStoreState = {
    users: UserPagiType | undefined;
};

export const useUsersStore = defineStore('userStore', {
    state: () => ({
        users: undefined
    } as UserStoreState),
    actions: {
        setUserApi(users: UserPagiType) {
            this.users = users;
        },
        async fetchUserApi(params: ParamsUserPagi) {
            const res = await userApi.getUsers(params);
            if (res) this.setUserApi(res);
        }
    }
});