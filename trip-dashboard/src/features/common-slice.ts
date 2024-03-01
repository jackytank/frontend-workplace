import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CommonState = {
    loading: boolean;
    error: string | null;
};

const initialState: CommonState = {
    loading: false,
    error: null,
};

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setLoading,
    setError
} = commonSlice.actions;

export default commonSlice.reducer;