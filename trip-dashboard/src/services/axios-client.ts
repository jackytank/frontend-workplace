import axios from 'axios';
import { production as development } from '../configs/env';

const axiosClient = axios.create({
  baseURL: development.url,
  timeout: development.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosClient.interceptors.request.use(
  (config) => {
    // perform handles, eg: add token into header, edit parameter
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    // perform handles, eg: send action login success
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
