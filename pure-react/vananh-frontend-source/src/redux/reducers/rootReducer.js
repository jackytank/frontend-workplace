import { combineReducers } from 'redux';
import taskReducer from './task.reducer';
import authReducer from './auth.reducer';

const rootReducer = combineReducers({
  tasks: taskReducer,
  auth: authReducer
});

export default rootReducer;
