import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DrawableTrain,
  PassengerFlow,
  StationSequence
} from '../../pages/dia-man-machine/chart/types';

export interface TimeState {
  hour: number;
  minute: number;
}

export interface TimetableState {
  time: TimeState;
  companyName: string;
}

export interface SimRailRoadState {
  railCode: number;
  railName: string;
  railCompany: string;
}

const initialState: TimetableState = {
  time: { hour: 7, minute: 0 },
  companyName: ''
};

const TimetableReducer = createSlice({
  name: 'TimetableReducer',
  initialState,
  reducers: {
    setConfiguration: (state, action: PayloadAction<TimetableState>) => {
      state.time = action.payload.time;
      state.companyName = action.payload.companyName;
    }
  }
});

const railRoadInitialState: { simRailRoads: SimRailRoadState[] } = {
  simRailRoads: []
};
const RailRoadReducer = createSlice({
  name: 'RailRoadReducer',
  initialState: railRoadInitialState,
  reducers: {
    setSimRailRoads: (state, action: PayloadAction<SimRailRoadState[]>) => {
      state.simRailRoads = action.payload;
    }
  }
});

export interface TimetableDimensionState {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

const margin = { top: 50, right: 60, bottom: 40, left: 40 };
const timetableDimensionInitialState: { dimension: TimetableDimensionState } = {
  dimension: {
    width: window.innerWidth - margin.left - margin.right - 150,
    height: window.innerHeight - margin.top - margin.bottom,
    margin
  }
};
const TimetableDimensionReducer = createSlice({
  name: 'TimetableDimensionReducer',
  initialState: timetableDimensionInitialState,
  reducers: {
    setTimetableDimension: (state, action: PayloadAction<TimetableDimensionState>) => {
      state.dimension = { ...state.dimension, ...action.payload };
    }
  }
});

export interface TrainDatasource {
  predictedTrainRuns: DrawableTrain[];
  resultedTrainRuns: DrawableTrain[];
  plannedTrainRuns: DrawableTrain[];
}

export interface KpiMemo {
  filename: string
  unkFlag: number
  chargeArvDelay: number
  chargeDptDelay: number
  allArvDelay: number
  allDptDelay: number
  difChargeArvDelay: number
  difChargeDptDelay: number
  difAllArvDelay: number
  difAllDptDelay: number
  allCanStation: number
  localArvDelay: number
  localDptDelay: number
  chargeCancel: number
  chargeParTial: number
  localCancel: number
  localParTial: number
  allCancel: number
  allParTial: number
  chargeCanStation: number
  localCanStation: number
  allLinkset: number
  chargeLinkset: number
  localLinkset: number
  allLinkcut: number
  chargeLinkcut: number
  localLinkcut: number
  allBunkatsu: number
  chargeBunkatsu: number
  localBunkatsu: number
  allCutbunkatsu: number
  chargeCutbunkatsu: number
  localCutbunkatsu: number
  allHeigou: number
  chargeHeigou: number
  localHeigou: number
  allCutheigou: number
  chargeCutheigou: number
  localCutheigou: number
  allToku: number
  chargeToku: number
  localToku: number
  allStoptime: number
  chargeStoptime: number
  localStoptime: number
  allSotChange: number
  chargeSotChange: number
  localSotChange: number
  allTrackChange: number
  chargeTrackChange: number
  localTrackChange: number
  allRinjiTrain: number
  chargeRinjiTrain: number
  localRinjiTrain: number
  allRecoverTime: number
  chargeRecoverTime: number
  localRecoverTime: number
}

export interface KpiMemoState {
  kpiMemo: KpiMemo;
}

export interface TimetableDataSource {
  stationSequence: StationSequence[];
  passengerFlowData: PassengerFlow[];
}

const kpiMemoState: KpiMemoState = {
  kpiMemo : {
    filename: '',
    unkFlag: 0,
    chargeArvDelay: 0,
    chargeDptDelay: 0,
    allArvDelay: 0,
    allDptDelay: 0,
    difChargeArvDelay: 0,
    difChargeDptDelay: 0,
    difAllArvDelay: 0,
    difAllDptDelay: 0,
    allCanStation: 0,
    localArvDelay: 0,
    localDptDelay: 0,
    chargeCancel: 0,
    chargeParTial: 0,
    localCancel: 0,
    allCancel: 0,
    allParTial: 0,
    chargeCanStation: 0,
    localCanStation: 0,
    allLinkset: 0,
    chargeLinkset: 0,
    localLinkset: 0,
    allLinkcut: 0,
    chargeLinkcut: 0,
    localLinkcut: 0,
    allBunkatsu: 0,
    chargeBunkatsu: 0,
    localBunkatsu: 0,
    allCutbunkatsu: 0,
    chargeCutbunkatsu: 0,
    localCutbunkatsu: 0,
    allHeigou: 0,
    chargeHeigou: 0,
    localHeigou: 0,
    allCutheigou: 0,
    chargeCutheigou: 0,
    localCutheigou: 0,
    allToku: 0,
    chargeToku: 0,
    localToku: 0,
    allStoptime: 0,
    chargeStoptime: 0,
    localStoptime: 0,
    allSotChange: 0,
    chargeSotChange: 0,
    localSotChange: 0,
    allTrackChange: 0,
    chargeTrackChange: 0,
    localTrackChange: 0,
    allRinjiTrain: 0,
    chargeRinjiTrain: 0,
    localRinjiTrain: 0,
    allRecoverTime: 0,
    chargeRecoverTime: 0,
    localRecoverTime: 0,
    localParTial: 0
  }
}

const trainsInitialState: { trains: TrainDatasource; sourceTrains: TrainDatasource } = {
  trains: {
    // Data that store renderable trains
    predictedTrainRuns: [],
    resultedTrainRuns: [],
    plannedTrainRuns: []
  },
  sourceTrains: {
    // Used as a backup data. should not render graph from this source
    predictedTrainRuns: [],
    resultedTrainRuns: [],
    plannedTrainRuns: []
  }
};
const TrainReducer = createSlice({
  name: 'TrainReducer',
  initialState: trainsInitialState,
  reducers: {
    setTrains: (state, action: PayloadAction<Partial<TrainDatasource>>) => {
      state.trains = { ...state.trains, ...action.payload };
    },
    updateSourceTrains: (state, action: PayloadAction<DrawableTrain>) => {
      state.sourceTrains.predictedTrainRuns = state.sourceTrains.predictedTrainRuns.map((t) =>
        t.trainNo === action.payload.trainNo ? action.payload : t
      );
      state.trains.predictedTrainRuns = state.trains.predictedTrainRuns.map((t) =>
        t.trainNo === action.payload.trainNo ? action.payload : t
      );
    },
    setSourceTrains: (state, action: PayloadAction<Partial<TrainDatasource>>) => {
      state.sourceTrains = { ...state.trains, ...action.payload };
    }
  }
});

const KpiMemoReducer = createSlice({
  name: 'KpiMemoReducer',
  initialState: kpiMemoState,
  reducers: {
    setKpiMemo: (state, action: PayloadAction<KpiMemo>) => {
      state.kpiMemo = { ...action.payload } ;
    },
  }
});

export const { setConfiguration } = TimetableReducer.actions;
export const { setSimRailRoads } = RailRoadReducer.actions;
export const { setTimetableDimension } = TimetableDimensionReducer.actions;
export const { setTrains, setSourceTrains, updateSourceTrains } = TrainReducer.actions;
export const { setKpiMemo } = KpiMemoReducer.actions;
export const { reducer: timetableReducer } = TimetableReducer;
export const { reducer: railRoadReducer } = RailRoadReducer;
export const { reducer: timetableDimensionReducer } = TimetableDimensionReducer;
export const { reducer: trainReducer } = TrainReducer;
export const { reducer: kpiMemoReducer } = KpiMemoReducer;
