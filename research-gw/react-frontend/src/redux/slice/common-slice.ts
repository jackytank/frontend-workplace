/* eslint-disable @typescript-eslint/no-unused-vars */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type CommonState = {
    isLoading: boolean;
};

const initialState: CommonState = {
    isLoading: false,
};

const commonSlice = createSlice({
    name: 'commonSlice',
    initialState: initialState,
    reducers: {
        setLoading: (state: CommonState, action: PayloadAction<boolean>): void => {
            state.isLoading = action.payload;
        }
    }
});

export const {
    setLoading
} = commonSlice.actions;

export default commonSlice.reducer;