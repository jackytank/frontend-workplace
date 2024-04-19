/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

export type AnalysisState = {
    dataLogs: DataLogsResponseType | null;
};

const initialState: AnalysisState = {
    dataLogs: null,
};

const chatSlice = createSlice({
    name: 'analysisSlice',
    initialState: initialState,
    reducers: {
        setDataLogs: (state, action: { payload: DataLogsResponseType | null; }) => {
            state.dataLogs = action.payload;
        },
    },
});

export const {
    setDataLogs
} = chatSlice.actions;

export default chatSlice.reducer;