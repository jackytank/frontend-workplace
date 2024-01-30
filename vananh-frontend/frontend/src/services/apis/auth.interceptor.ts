import axios from 'axios';
import { useEffect } from 'react';
import { production } from '../../config/env';
import useTRANotification from '../../hooks/useNotification';

const instance = axios.create({
  baseURL: production.url,
  timeout: production.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

const AxiosInterceptor = ({ children }) => {
  const { createNotification } = useTRANotification();

  useEffect(() => {
    // interceptor to handle requests before send
    instance.interceptors.request.use(
      (config) => {
        // perform handles, eg: add token into header, edit parameter

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // interceptor to handle reponses after receive
    const interceptor = instance.interceptors.response.use(
      (response) => {
        // perform handles, eg: send action login success

        return response;
      },
      (error) => {
        createNotification(error.message || 'Fail to fetch!', { variant: 'error' });
        return Promise.reject(error);
      }
    );

    return () => instance.interceptors.response.eject(interceptor);
  }, []);

  return children;
};

export default instance;
export { AxiosInterceptor };
