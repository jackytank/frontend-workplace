import { createSlice } from '@reduxjs/toolkit';

interface CommonState {
  isLoading: boolean;
}

const initialState: CommonState = {
  isLoading: false,
};

const common = createSlice({
  name: 'common',
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

const { reducer, actions } = common;
export const { setLoading } = actions;
export default reducer;
