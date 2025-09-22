import {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { QueueItem } from "./queue-item";

const isClient = typeof window !== "undefined";

let isRefreshing = false;

let failedQueue: QueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

export const setupInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const prefix = isClient ? "[Client]" : "[Server]";
      console.log(
        `${prefix} API Request:`,
        config.method?.toUpperCase(),
        config.url,
        config.headers
      );
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (originalRequest.url?.includes("/auth/refresh")) {
          processQueue(error, null);

          if (isClient) {
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              originalRequest._retry = true;
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          if (isClient) {
            await instance.post(
              "/auth/refresh",
              {},
              {
                withCredentials: true,
              }
            );

            processQueue(null, "success");

            return instance(originalRequest);
          } else {
            // @ts-ignore
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();

            await instance.post(
              "/auth/refresh",
              {},
              {
                headers: {
                  Cookie: cookieStore.toString(),
                },
              }
            );

            processQueue(null, "success");

            return instance(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError as AxiosError, null);

          if (isClient) {
            try {
              window.location.href = "/login";
            } catch (redirectError) {
              console.error("Failed to redirect to login:", redirectError);
            }
          } else {
            console.error("Token refresh failed on server:", {
              error: refreshError,
              url: originalRequest.url,
              method: originalRequest.method,
            });
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
