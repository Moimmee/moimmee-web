import { ApiRequest } from './api-request';
import { createAxiosInstance } from './axios-instance';
import { ApiRequestConfig } from './api-request-config';

const axiosInstance = createAxiosInstance();

const apiClient = {
  get<T = any>(url: string, config?: ApiRequestConfig): ApiRequest<T> {
    return new ApiRequest<T>(url, 'GET', config, axiosInstance);
  },

  post<T = any>(url: string, data?: any, config?: ApiRequestConfig): ApiRequest<T> {
    return new ApiRequest<T>(url, 'POST', { ...config, data }, axiosInstance);
  },

  put<T = any>(url: string, data?: any, config?: ApiRequestConfig): ApiRequest<T> {
    return new ApiRequest<T>(url, 'PUT', { ...config, data }, axiosInstance);
  },

  patch<T = any>(url: string, data?: any, config?: ApiRequestConfig): ApiRequest<T> {
    return new ApiRequest<T>(url, 'PATCH', { ...config, data }, axiosInstance);
  },

  delete<T = any>(url: string, config?: ApiRequestConfig): ApiRequest<T> {
    return new ApiRequest<T>(url, 'DELETE', config, axiosInstance);
  }
};

export default apiClient;
