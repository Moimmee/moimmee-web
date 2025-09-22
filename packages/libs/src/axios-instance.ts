import axios, { AxiosInstance } from 'axios';
import { setupInterceptors } from './interceptors';

export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: false,
  });

  setupInterceptors(instance);

  return instance;
};
