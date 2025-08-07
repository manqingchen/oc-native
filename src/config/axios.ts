/**
 * Axios 配置
 * 统一的 HTTP 请求配置和拦截器
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { env } from './env';
import { ERROR_TYPES } from './constants';
import { cacheManager } from './storage';

// 创建 Axios 实例
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 添加请求时间戳
    config.metadata = { startTime: Date.now() };
    
    // 添加认证头（如果有的话）
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    // 日志记录
    if (env.isDev) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      console.log('Request config:', config);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 计算请求耗时
    const duration = Date.now() - response.config.metadata?.startTime;
    
    // 日志记录
    if (env.isDev) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
      console.log('Response data:', response.data);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const duration = Date.now() - error.config?.metadata?.startTime;
    
    // 日志记录
    if (env.isDev) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`);
      console.error('Error details:', error.response?.data || error.message);
    }
    
    // 错误处理
    const enhancedError = enhanceError(error);
    
    // 重试逻辑
    if (shouldRetry(error)) {
      return retryRequest(error);
    }
    
    return Promise.reject(enhancedError);
  }
);

// 错误增强函数
function enhanceError(error: AxiosError): AxiosError & { type: string } {
  let errorType = ERROR_TYPES.UNKNOWN_ERROR;
  
  if (!error.response) {
    // 网络错误
    errorType = ERROR_TYPES.NETWORK_ERROR;
  } else if (error.response.status >= 400 && error.response.status < 500) {
    // 客户端错误
    errorType = ERROR_TYPES.API_ERROR;
  } else if (error.response.status >= 500) {
    // 服务器错误
    errorType = ERROR_TYPES.API_ERROR;
  }
  
  return { ...error, type: errorType };
}

// 重试判断函数
function shouldRetry(error: AxiosError): boolean {
  // 只对网络错误和 5xx 错误进行重试
  if (!error.response) return true;
  if (error.response.status >= 500) return true;
  if (error.response.status === 429) return true; // 限流错误
  
  return false;
}

// 重试请求函数
async function retryRequest(error: AxiosError): Promise<AxiosResponse> {
  const config = error.config;
  if (!config) {
    return Promise.reject(error);
  }
  
  // 初始化重试计数
  config.retryCount = config.retryCount || 0;
  
  // 检查是否超过最大重试次数
  if (config.retryCount >= env.API_RETRY_COUNT) {
    return Promise.reject(error);
  }
  
  // 增加重试计数
  config.retryCount += 1;
  
  // 计算延迟时间（指数退避）
  const delay = Math.pow(2, config.retryCount) * 1000;
  
  console.log(`🔄 Retrying request (${config.retryCount}/${env.API_RETRY_COUNT}) after ${delay}ms`);
  
  // 延迟后重试
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return apiClient(config);
}

// 带缓存的 GET 请求
export async function getCached<T>(
  url: string,
  config?: AxiosRequestConfig,
  cacheKey?: string,
  cacheTime?: number
): Promise<T> {
  const key = cacheKey || `api_${url}_${JSON.stringify(config?.params || {})}`;
  
  // 尝试从缓存获取
  const cachedData = cacheManager.getCache<T>(key);
  if (cachedData) {
    console.log(`📦 Cache hit for ${url}`);
    return cachedData;
  }
  
  // 发起请求
  const response = await apiClient.get<T>(url, config);
  
  // 缓存响应数据
  cacheManager.setCache(key, response.data, cacheTime);
  
  return response.data;
}

// 通用请求方法
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config).then(response => response.data),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config).then(response => response.data),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config).then(response => response.data),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config).then(response => response.data),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config).then(response => response.data),
    
  // 带缓存的 GET 请求
  getCached: getCached,
};

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
    retryCount?: number;
  }
}

export default api;
