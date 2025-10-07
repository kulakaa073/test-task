import axios from 'axios';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  return response.data; // check for actual response structure!!!
});

interface TransformedAxios {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T>;
}

const api = axiosInstance as unknown as TransformedAxios;
export default api;
