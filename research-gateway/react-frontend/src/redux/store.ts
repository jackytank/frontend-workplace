import { configureStore } from "@reduxjs/toolkit";
import analysisReducer from "./slice/analysis-slice";

const store = configureStore({
    reducer: {
        analysis: analysisReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;