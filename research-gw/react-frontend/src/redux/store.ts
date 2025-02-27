import { configureStore } from "@reduxjs/toolkit";
import analysisReducer from "./slice/analysis-slice";
import commonReducer from "./slice/common-slice";

export const store = configureStore({
    reducer: {
        analysis: analysisReducer,
        common: commonReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;