import { ActionReducerMapBuilder, PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { EmployeeModelApi } from "../../routes/employee/EmployeeReturnCols";
import { employeeApi } from "../../api/EmployeeApi";
import { AxiosResponse } from "axios";

interface EmployeeState {
    employeeList: EmployeeModelApi[];
    isLoading: boolean;
}

const initialState: EmployeeState = {
    employeeList: [],
    isLoading: false
};

export const getEmployeeList = createAsyncThunk('employee/getEmployeeList', () => {
    return employeeApi.getALl().then((res: AxiosResponse<EmployeeModelApi[]>) => {
        if (res.status === 200) {
            return res.data;
        }
    });
});

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setEmployeeList: (state, action: PayloadAction<EmployeeModelApi[]>) => {
            state.employeeList = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder: ActionReducerMapBuilder<EmployeeState>) => {
        builder
            .addCase(getEmployeeList.pending, (state) => {
                console.log('pending state');
                state.isLoading = true;
            })
            .addCase(getEmployeeList.fulfilled, (state, action) => {
                console.log('fulfilled state');
                state.isLoading = false;
                state.employeeList = action.payload as EmployeeModelApi[];
            })
            .addCase(getEmployeeList.rejected, (state) => {
                console.log('rejected');
                state.isLoading = false;
            });
    }
});

export default employeeSlice.reducer;