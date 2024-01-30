export interface Station {
  stationCode: number;
  stationName: string;
  distance: number;
  axisDistance: number;
  trackList: Track[];
  isExpandedPlatform: boolean;
}

export interface PlatformStation extends Station {
  isPlatform: boolean;
  isPadding?: boolean;
  platformTrackCode: number;
  parentStationName: string;
}

export interface Track {
  trackName: string;
  trackCode: number;
  homeTrackFg: number;
  propQ: TrackProp[];
}

export interface TrackProp {
  seqId: number;
}

export interface Train {
  trainNo: number;
  trainNoName: string;
  stayActiveCode: number;
  chargeFlag: number;
  mainShuntFlag: number;
  /**
   * Contain array of all trainRun.
   */
  trainRunList: TrainLineRun[];
}

export interface DrawableTrain extends Train {
  /**
   * Contain array of trainRun that can be able to draw with list of current stations display on the chart.
   */
  drawableTrainRunList: TrainLineRun[];
}

export enum TrainDirection {
  UP = 1,
  DOWN = 0
}

export enum TrainPassOrStopCode {
  PASS = 0,
  STOP = 1
}

export enum TrainPassengerFlow {
  OFF = 0,
  ON = 1
}

export interface TrainTime {
  plannedArvTime: string;
  plannedDptTime: string;
  simulatedArvTime: string;
  simulatedDptTime: string;
  resultedArvTime: string;
  resultedDptTime: string;
}

export interface TrainData {
  trainNumber: number;
  internalTrainID: number;
  start: string;
  end: string;
  previousOperations: number;
  nextOperations: number;
  splitAt: number;
  joinAt: number;
  trainsAfterSplit: number;
  trainsBeforeJoin: number;
  powerType: number;
}

export enum Time {
  PLANNED,
  SIMULATED,
  RESULTED
}

export enum StayActiveCode {
  STAY = 1,
  ACTIVE = 0
}

export interface TrainStayActiveCode {
  arvStayActiveCode: StayActiveCode;
  dptStayActiveCode: StayActiveCode;
  stayActiveCode: StayActiveCode;
  // planStayActiveCode: StayActiveCode
}

export interface TrainLineRun extends TrainTime, TrainStayActiveCode {
  trainNoName: string;
  trainNo: string;
  stationCode: number;
  distance: number;
  axisDistance: number;
  axisTime: Date;
  plannedTrackCode: number;
  upDownCode: TrainDirection;
  runSequence: number;
  passOrStopCode: TrainPassOrStopCode;
  linkTrainPoint: number;
  frontLinkTrainQ: [number, number, number];
  backLinkTrainQ: [number, number, number];
  stopType: number;
  plannedPassOrStopCode: number;
  resultedArvFlag: number;
  tokuhatsuFg: number;
  bothN: number;
  arvRailCode: number;
  dptRailCode: number;
  trainType: number;
  runKind: number;
  dptTrackCode: number;
  resultedDptFlag: number;
  stopRate: number;
  powerType: number;
  speedType: number;
}

export enum DataDrawMode {
  StayDiaDrawMode = -3,
  PlannedDiaDrawMode = -2,
  SimulatedDiaDrawMode = -1,
  ActualDiaDrawMode = -5,
  StayDiaCheckMode = -6
}

export enum FrontBackDrawMode {
  FRONT = 0,
  BACK = 1,
  PLANNED_SERVICE_SUSPENTION = 2,
  NORMALLY_SUSPENTION = 3,
  HIGHLIGHTED_SUSPENTION = 4,
  OTHER = -1
}

export enum DataType {
  PLANNED = 'planned',
  PREDICTED = 'predicted',
  RESULTED = 'resulted'
}

export interface TimetableDrawMode {
  dataDrawMode: DataDrawMode;
  frontBackDrawMode: FrontBackDrawMode;
}
export interface PassengerConfig {
  congestionRanges: {
    MEDIUM: { MIN: number; MAX: number; COLOR_RANGE: string };
    HIGH: { MIN: number; COLOR_RANGE: string };
    LOW: { MIN: number; MAX: number; COLOR_RANGE: string };
  };
}

export interface StationList {
  stationCode: number;
  distance: number;
}
export interface StationSequence {
  seqId: number;
  stationList: StationList[];
}

export interface PassengerFlow {
  trainNo: string;
  stationCode: number;
  neighborStationCode: number;
  passengerCount: number;
  capacity: number;
  railCompany: string;
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
