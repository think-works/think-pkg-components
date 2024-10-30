import type { AxiosRequestConfig } from "axios";
import axios from "axios";

/**
 * 基础路径
 */
export const baseURL = `/quality/api`;

/**
 * axios 工厂
 */
export const createAxiosInstance = (config?: AxiosRequestConfig) => {
  const http = axios.create({
    timeout: 60 * 1000,
    withCredentials: true,
    ...(config || {}),
  });

  return http;
};

/**
 * axios 实例
 */
export const axiosInstance = createAxiosInstance({ baseURL });

export default axiosInstance;
