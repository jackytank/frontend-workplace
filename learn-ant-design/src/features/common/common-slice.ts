import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CommonState {
    isLoading: boolean;
}

const initialState: CommonState = {
    isLoading: false,
};

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
});

export const { setLoading } = commonSlice.actions;
export default commonSlice.reducer;