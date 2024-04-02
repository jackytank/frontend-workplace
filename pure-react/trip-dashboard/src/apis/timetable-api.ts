import { API_PATH } from '../constants/api';
import authAxios from '../services/axios-client';
import { AxiosResponse } from 'axios';

interface TimetableApi {
  getStationSequence: (railCompany: string) => Promise<AxiosResponse>;
  getTimetableData: (railCompany: string) => Promise<AxiosResponse>;
  getTrainTypeData: (railCompany: string) => Promise<AxiosResponse>;
  getPassengerFlow: (railCompany: string) => Promise<AxiosResponse>;
  getPredictTimetable: (railCompany: string, rawBody: string) => Promise<AxiosResponse>;
  getOutputTimetable: (railCompany: string, rawBody: string) => Promise<AxiosResponse>;
}

const timetableApi: TimetableApi = {
  getStationSequence: (railCompany) => {
    return authAxios.get(API_PATH.GET_STATION_SEQUENCE + `?rail-company=${railCompany}`);
  },
  getTimetableData: (railCompany) => {
    return authAxios.get(API_PATH.GET_TIMETABLE_DATA + `?rail-company=${railCompany}`);
  },
  getTrainTypeData: (railCompany) => {
    return authAxios.get(API_PATH.GET_TRAIN_TYPE_DATA + `?rail-company=${railCompany}`);
  },
  getPassengerFlow: (railCompany) => {
    return authAxios.get(API_PATH.GET_PASSENGER_FLOW + `?rail-company=${railCompany}`);
  },
  getPredictTimetable: (railCompany, body) => {
    return authAxios.post(API_PATH.GET_PREDICT + `?rail-company=${railCompany}`, body);
  },
  getOutputTimetable: (railCompany, body) => {
    return authAxios.post(API_PATH.GET_OUTPUT + `?rail-company=${railCompany}`, body);
  }
};

export default timetableApi;
