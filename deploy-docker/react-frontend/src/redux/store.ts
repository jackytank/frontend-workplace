import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./slice/chat-slice";

const store = configureStore({
    reducer: {
        chat: chatReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;