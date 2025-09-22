import axios, { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false,
  });

  setupInterceptors(instance);

  return instance;
};
