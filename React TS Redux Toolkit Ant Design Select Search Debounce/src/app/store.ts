import { configureStore } from '@reduxjs/toolkit';
import commonReducer from '../features/common-slice.ts';

const rootReducer = {
  common: commonReducer,
};
const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
