/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

export type ChatState = {
    stompClient: unknown | null;
};

const initialState: ChatState = {
    stompClient: null,
};

const chatSlice = createSlice({
    name: 'chatSlice',
    initialState: initialState,
    reducers: {
        setStompClient: (state, action) => {
            state.stompClient = action.payload;
        },
    },
});

export const {
    setStompClient
} = chatSlice.actions;

export default chatSlice.reducer;