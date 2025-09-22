import { AxiosError } from "axios";

export interface QueueItem {
  resolve: (value: string | null) => void;
  reject: (error: AxiosError | null) => void;
}