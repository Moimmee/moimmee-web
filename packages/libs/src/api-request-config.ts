import { AxiosRequestConfig } from 'axios';

export interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'method' | 'url'> {
  withCredentials?: boolean;
  _useServerCookies?: boolean;
}