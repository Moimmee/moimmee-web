import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiRequestConfig } from './types';

const isClient = typeof window !== 'undefined';

export class ApiRequest<T = any> {
  private url: string;
  private method: string;
  private config: ApiRequestConfig;
  private axiosInstance: AxiosInstance;

  constructor(url: string, method: string, config: ApiRequestConfig = {}, axiosInstance: AxiosInstance) {
    this.url = url;
    this.method = method;
    this.config = config;
    this.axiosInstance = axiosInstance;
  }

  withCookie(): ApiRequest<T> {
    if (isClient) {
      return new ApiRequest<T>(this.url, this.method, {
        ...this.config,
        withCredentials: true
      }, this.axiosInstance);
    } else {
      return new ApiRequest<T>(this.url, this.method, {
        ...this.config,
        _useServerCookies: true
      }, this.axiosInstance);
    }
  }

  async execute(): Promise<AxiosResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      method: this.method as any,
      url: this.url,
      ...this.config
    };

    if (!isClient && (this.config as ApiRequestConfig)._useServerCookies) {
      try {
        // @ts-ignore
        const nextHeaders = await import('next/headers');
        // @ts-ignore
        const cookies = nextHeaders.cookies;
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();
        
        if (cookieString) {
          requestConfig.headers = {
            ...requestConfig.headers,
            Cookie: cookieString
          };
        }
      } catch (error) {
        console.warn('Failed to get server-side cookies:', error);
      }
    }

    return this.axiosInstance.request<T>(requestConfig);
  }

  then<TResult1 = AxiosResponse<T>, TResult2 = never>(
    onfulfilled?: ((value: AxiosResponse<T>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<AxiosResponse<T> | TResult> {
    return this.execute().catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<AxiosResponse<T>> {
    return this.execute().finally(onfinally);
  }
}
