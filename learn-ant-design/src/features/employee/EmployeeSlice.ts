import { Action, Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { employeeApi } from "../../api/EmployeeApi";
import { EmployeeModelApi, EmployeeSearchFormType } from "../../routes/employee/Employee.Types";

interface EmployeeState {
    employeeList: EmployeeModelApi[];
    isLoading: boolean;
}

const initialState: EmployeeState = {
    employeeList: [],
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
            state.employeeList = action.payload;
        },
        deleteEmployee: (state, action: PayloadAction<number>) => {
            state.employeeList = state.employeeList.filter((employee) => employee.id !== action.payload);
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
    deleteEmployee,
    setLoading
} = employeeSlice.actions;
export default employeeSlice.reducer;