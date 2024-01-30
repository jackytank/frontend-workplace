import { configureStore } from '@reduxjs/toolkit';
import {
  timetableReducer,
  railRoadReducer,
  timetableDimensionReducer,
  trainReducer,
  kpiMemoReducer
} from './reducers/timetable.reducer';
import { visibleTrainReducer } from './reducers/visibleTrain.reducer';
import { loadingReducer } from './reducers/common.reducer';
import { editArrivalDeparturePlatformReducer } from './reducers/edit-platform.reducer';

export const store = configureStore({
  reducer: {
    timetableReducer,
    railRoadReducer,
    timetableDimensionReducer,
    trainReducer,
    visibleTrainReducer,
    loadingReducer,
    kpiMemoReducer,
    editArrivalDeparturePlatformReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
