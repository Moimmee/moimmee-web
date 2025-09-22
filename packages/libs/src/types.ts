import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'method' | 'url'> {
  withCredentials?: boolean;
  _useServerCookies?: boolean;
}

export type { AxiosResponse };
