import { defineStore } from "pinia";

type CommonStoreState = {
    isLoading: boolean;
};

export const useCommonStore = defineStore('commonStore', {
    state: () => ({
        isLoading: false
    } as CommonStoreState),
    actions: {
        setLoading(value: boolean) {
            this.isLoading = value;
        }
    }
});