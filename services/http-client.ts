import { useUserStore } from '@/api/request';
import { baseURL } from '@/lib/config';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// 创建axios实例
export const httpClient = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true, // 允许跨域请求携带 cookies
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  },
});

// 请求拦截器
httpClient.interceptors.request.use(
  async (config) => {
    const token = useUserStore.getState().token
    if (token) {
      config.headers.Token = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
httpClient.interceptors.response.use(
  (response) => {
    if (response.data.code === 20001) {
    }
    return response;
  },
  (error: AxiosError) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 处理未授权情况
      // 例如：重定向到登录页
    }
    return Promise.reject(error);
  }
);

// 通用请求方法
export const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await httpClient(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 测试 CORS 配置是否生效
export const testCorsConfig = async () => {
  try {
    const response = await httpClient.get('/test-endpoint');
    console.log('CORS 配置正常，请求成功：', response);
    return response;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('CORS 配置问题：', {
        status: error.response?.status,
        headers: error.response?.headers,
        message: error.message,
        config: error.config
      });
    }
    throw error;
  }
}; 