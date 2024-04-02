import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface TrainData {
  trainNo: string;
  trainNoName: string;
}

interface StationData {
  stationCode: number;
  stationName: string;
}

interface PlatformData {
  trackName: string;
  trackCode: number;
  homeTrackFg: number;
}

export interface EditFormData {
  train?: TrainData;
  station?: StationData;
  platform?: PlatformData;
}

interface EditArrivalDeparturePlatformState {
  isEditArrivalDeparturePlatformPanelVisible: boolean;
  formData?: EditFormData;
}

const editArrivalDeparturePlatformInitialState: EditArrivalDeparturePlatformState = {
  isEditArrivalDeparturePlatformPanelVisible: false
};
const EditArrivalDeparturePlatformReducer = createSlice({
  name: 'editArrivalDeparturePlatformReducer',
  initialState: editArrivalDeparturePlatformInitialState,
  reducers: {
    setIsEditArrivalDeparturePlatformPanelVisible: (state, action: PayloadAction<boolean>) => {
      state.isEditArrivalDeparturePlatformPanelVisible = action.payload;
    },
    setForm: (state, action: PayloadAction<EditFormData>) => {
      state.formData = { ...state.formData, ...action.payload };
    }
  }
});

export const { setForm, setIsEditArrivalDeparturePlatformPanelVisible } =
  EditArrivalDeparturePlatformReducer.actions;
export const { reducer: editArrivalDeparturePlatformReducer } = EditArrivalDeparturePlatformReducer;
