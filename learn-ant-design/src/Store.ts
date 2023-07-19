import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import employeeReducer from './features/employee/EmployeeSlice';
import commonReducer from './features/common/CommonSlice';

export const store = configureStore({
    reducer: {
        common: commonReducer,
        employee: employeeReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;