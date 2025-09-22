import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const isClient = typeof window !== 'undefined';

export const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (isClient) {
        console.log('Client-side request:', config.url);
      } else {
        console.log('Server-side request:', config.url);
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (isClient) {
        // 클라이언트 전용 응답 처리
      } else {
        // 서버사이드 전용 응답 처리
      }
      return response;
    },
    (error: AxiosError) => {
      if (isClient) {
        console.error('Client error:', error.message);
      } else {
        console.error('Server error:', error.message);
      }
      return Promise.reject(error);
    }
  );
};
