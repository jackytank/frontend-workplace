export const API_PATH: { [key: string]: string } = {
  GET_INITIALIZE: 'initialize',
  GET_CONFIGURATION: 'configuration',
  GET_STATION_SEQUENCE: 'timetable/station-sequence',
  GET_TIMETABLE_DATA: 'timetable/timetable-data',
  GET_TRAIN_TYPE_DATA: 'timetable/sim-train-type',
  GET_PASSENGER_FLOW: 'timetable/passenger-flow',
  GET_PREDICT: 'timetable-engine/predict',
  GET_OUTPUT: 'timetable-engine/output'
};

export const RESPONSE_CODE: { [key: string]: number } = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SYSTEM_ERROR: 500
};
