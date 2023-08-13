import { Action, Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";

interface TodoState {
    id: number;
    title: string;
    completed: boolean;
}

const initialState: TodoState[] = [
    { id: 1, title: 'todo 1', completed: false },
    { id: 2, title: 'todo 2', completed: false },
    { id: 3, title: 'todo 3', completed: false },
];

const addTodo = () => (dispatch: Dispatch<Action>)=>{
    return null;
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        setTodo: (state, action: PayloadAction<TodoState>) => {
            state.push(action.payload);
        }
    }
});

export const {
    setTodo
} = todoSlice.actions;

export default todoSlice.reducer;