import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface DataTypeOptions {
  all: boolean;
  predicted: boolean;
  resulted: boolean;
  planned: boolean;

  plannedMuted: boolean;
}

export interface TrainDirectionOptions {
  all: boolean;
  up: boolean;
  down: boolean;
}

export interface VisibleTrainExtraOptions {
  limitDisplayedTrains: boolean,
  markInconsistencyNumberCars: boolean,
  markOperationsUnorganized: boolean,
  showPassengerFlow: boolean
}
export interface VisibleTrainOptions {
  dataType: DataTypeOptions;
  trainDirection: TrainDirectionOptions;
  optionVisibleTrainExtra: VisibleTrainExtraOptions;
}

const visibleTrainInitialState: VisibleTrainOptions = {
  dataType: {
    all: false,
    predicted: true,
    resulted: false,
    planned: false,
    plannedMuted: false
  },
  trainDirection: {
    all: true,
    up: true,
    down: true
  },
  optionVisibleTrainExtra: {
    limitDisplayedTrains: false,
    markInconsistencyNumberCars: false,
    markOperationsUnorganized: false,
    showPassengerFlow: false
  }
};

const VisibleTrainReducer = createSlice({
  name: 'VisibleTrainReducer',
  initialState: visibleTrainInitialState,
  reducers: {
    setDirectionOptions: (state, action: PayloadAction<TrainDirectionOptions>) => {
      state.trainDirection = { ...action.payload };
    },
    setDataTypeOptions: (state, action: PayloadAction<DataTypeOptions>) => {
      state.dataType = { ...action.payload };
    },
    setExtraVisibleTrainOptions: (state, action: PayloadAction<VisibleTrainExtraOptions>) => {
      state.optionVisibleTrainExtra = { ...action.payload };
    },
  }
});

export const { setDirectionOptions, setDataTypeOptions, setExtraVisibleTrainOptions } = VisibleTrainReducer.actions;
export const { reducer: visibleTrainReducer } = VisibleTrainReducer;
