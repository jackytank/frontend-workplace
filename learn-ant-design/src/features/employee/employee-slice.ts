import { Action, Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { employeeApi } from "../../api/employee-api";
import { EmployeeModelApi, EmployeeSearchFormType } from "../../routes/employee/employee.type";

interface EmployeeState {
    employeeList: EmployeeModelApi[];
    selectedEmployeeList: EmployeeModelApi[];
    isLoading: boolean;
}

const initialState: EmployeeState = {
    employeeList: [],
    selectedEmployeeList: [],
    isLoading: false
};

export const getEmployeeList = (
    { search, name, email, status }: EmployeeSearchFormType
) => async (dispatch: Dispatch<Action>) => {
    const response = await employeeApi.getAll({ search, name, email, status });
    if (response.status === 200) {
        const data = response.data as EmployeeModelApi[];
        const modifiedData = data.map((item) => ({ ...item, status: Math.floor(Math.random() * 3) }));
        dispatch(setEmployeeList(modifiedData as EmployeeModelApi[]));
    }
};

const employeeSlice = createSlice({
    name: 'employee',
    initialState,
    reducers: {
        setEmployeeList: (state, action: PayloadAction<EmployeeModelApi[]>) => {
            state.employeeList = action.payload.map((e, idx) => ({ ...e, uniqueKey: idx }));
        },
        setSelectedEmployeeList: (state, action: PayloadAction<EmployeeModelApi[]>) => {
            state.selectedEmployeeList = action.payload.map((e, idx) => ({ ...e, uniqueKey: idx }));
        },
        setRemoveEmployeeList: (state, action: PayloadAction<EmployeeModelApi>) => {
            state.employeeList = state.employeeList.filter((employee) => employee.uniqueKey !== action.payload.uniqueKey);
        },
        setRemoveSelectedEmployeeList: (state, action: PayloadAction<EmployeeModelApi>) => {
            state.selectedEmployeeList = state.selectedEmployeeList.filter((employee) => employee.uniqueKey !== action.payload.uniqueKey);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    },
    // extraReducers: (builder: ActionReducerMapBuilder<EmployeeState>) => {
    //     builder
    //         .addCase(getEmployeeList.pending, (state) => {
    //             console.log('pending state');
    //             state.isLoading = true;
    //         })
    //         .addCase(getEmployeeList.fulfilled, (state, action) => {
    //             console.log('fulfilled state');
    //             state.isLoading = false;
    //             state.employeeList = action.payload as EmployeeModelApi[];
    //         })
    //         .addCase(getEmployeeList.rejected, (state) => {
    //             console.log('rejected');
    //             state.isLoading = false;
    //         });
    // }
});

export const {
    setEmployeeList,
    setSelectedEmployeeList,
    setRemoveSelectedEmployeeList,
    setRemoveEmployeeList,
    setLoading
} = employeeSlice.actions;
export default employeeSlice.reducer;