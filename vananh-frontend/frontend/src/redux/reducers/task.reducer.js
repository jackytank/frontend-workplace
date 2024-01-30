import { ADD_TASK } from '../actions/task.action';

const initialState = {
  task: []
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        task: [...state.task, action.payload]
      };
    default:
      return state;
  }
};

export default taskReducer;
