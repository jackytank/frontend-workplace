import axios, { AxiosError, AxiosResponse } from 'axios';
import store from '../app/store';
import { message } from 'antd';
import { setLoading } from '../features/common-slice';
import { config } from '../constants/config';

export const axiosClient = axios.create({
  baseURL: config.REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  store.dispatch(setLoading(true));
  return config;
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(setLoading(false));
    return response;
  },
  (error: AxiosError) => {
    handleError(error);
  }
);

const handleError = (error: AxiosError) => {
  message.error(`Error: ${error.message}`);
};
