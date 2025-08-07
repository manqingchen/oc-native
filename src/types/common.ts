/**
 * 通用类型定义
 */

import type { ErrorType, ThemeType, LanguageType, AppState } from '../config/constants';

// API 响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: number;
}

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// 错误信息
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  code?: string | number;
  details?: any;
  timestamp: number;
}

// 加载状态
export interface LoadingState {
  isLoading: boolean;
  error: ErrorInfo | null;
  lastUpdated: number | null;
}

// 用户设置
export interface UserSettings {
  theme: ThemeType;
  language: LanguageType;
  notifications: {
    enabled: boolean;
    priceAlerts: boolean;
    transactionAlerts: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
  };
}

// 应用配置
export interface AppConfig {
  version: string;
  buildNumber: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    [key: string]: boolean;
  };
}

// 应用状态
export interface AppStateInfo {
  state: AppState;
  isOnline: boolean;
  isBackground: boolean;
  lastActiveTime: number;
}

// 缓存项
export interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  expiryTime: number;
  key: string;
}

// 网络状态
export interface NetworkStatus {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  isInternetReachable: boolean;
}

// 设备信息
export interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  version: string;
  model: string;
  screenWidth: number;
  screenHeight: number;
  isTablet: boolean;
}

// 位置信息
export interface LocationInfo {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

// 通知配置
export interface NotificationConfig {
  title: string;
  body: string;
  data?: any;
  sound?: string;
  badge?: number;
  priority?: 'high' | 'normal' | 'low';
}

// 键值对
export interface KeyValuePair<T = any> {
  key: string;
  value: T;
}

// 选项项
export interface OptionItem<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
}

// 菜单项
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  action?: () => void;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: string | number;
}

// 表单字段
export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio';
  value: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    pattern?: RegExp;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    custom?: (value: T) => boolean | string;
  };
  options?: OptionItem<T>[];
}

// 表单状态
export interface FormState<T = any> {
  values: T;
  errors: { [key: string]: string };
  touched: { [key: string]: boolean };
  isValid: boolean;
  isSubmitting: boolean;
}

export type { ErrorType, ThemeType, LanguageType, AppState };
