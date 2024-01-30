import { API_PATH } from '../../contant/api';
import authAxios from './auth.interceptor';
import { AxiosResponse } from 'axios';

interface InitializeApi {
  getInitialize: () => Promise<AxiosResponse>;
  postInitialize: (data: any) => Promise<AxiosResponse>;
  getConfiguration: (railCompany: string) => Promise<AxiosResponse>;
}

const initializeApi: InitializeApi = {
  getInitialize: () => {
    return authAxios.get(API_PATH.GET_INITIALIZE);
  },
  postInitialize: (data) => {
    return authAxios.post(API_PATH.GET_INITIALIZE, data);
  },
  getConfiguration: (railCompany) => {
    return authAxios.get(API_PATH.GET_CONFIGURATION + `?rail-company=${railCompany}`);
  }
};

export default initializeApi;
