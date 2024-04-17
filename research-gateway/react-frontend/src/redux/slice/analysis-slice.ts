/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

export type ChatState = {
    dataLogs: unknown | null;
};

const initialState: ChatState = {
    dataLogs: null,
};

const chatSlice = createSlice({
    name: 'analysisSlice',
    initialState: initialState,
    reducers: {
        setDataLogs: (state, action) => {
            state.dataLogs = action.payload;
        },
    },
});

export const {
    setDataLogs
} = chatSlice.actions;

export default chatSlice.reducer;