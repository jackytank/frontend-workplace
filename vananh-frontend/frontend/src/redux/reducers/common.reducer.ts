import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoadingState {
  label?: string;
  state: 'loading' | 'done';
}

const loadingInitialState: LoadingState = {
  label: 'Loading...',
  state: 'done'
};
const LoadingReducer = createSlice({
  name: 'LoadingReducer',
  initialState: { loading: loadingInitialState },
  reducers: {
    setLoading: (state, action: PayloadAction<LoadingState>) => {
      if (!action.payload.label) {
        action.payload.label = loadingInitialState.label;
      }
      state.loading = { ...action.payload };
    }
  }
});

export const { setLoading } = LoadingReducer.actions;
export const { reducer: loadingReducer } = LoadingReducer;
