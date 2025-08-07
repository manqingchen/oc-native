/**
 * 环境变量配置管理
 * 严禁硬编码，所有配置项通过环境变量管理
 */

import Constants from 'expo-constants';

interface EnvConfig {
  // Solana 配置
  SOLANA_RPC_URL: string;
  WALLET_CONNECT_PROJECT_ID: string;
  
  // 应用基础信息
  APP_NAME: string;
  APP_VERSION: string;
  
  // API 配置
  API_BASE_URL: string;
  API_TIMEOUT: number;
  API_RETRY_COUNT: number;
  
  // 国际化配置
  DEFAULT_LANGUAGE: string;
  SUPPORTED_LANGUAGES: string[];
  
  // 图表配置
  CHART_THEME: string;
  CHART_ANIMATION_DURATION: number;
  
  // 存储配置
  MMKV_ENCRYPTION_KEY: string;
  STORAGE_VERSION: string;
  CACHE_EXPIRY_TIME: number;
  
  // UI 主题配置
  DEFAULT_THEME: 'light' | 'dark';
  ENABLE_DARK_MODE: boolean;
  ANIMATION_DURATION: number;
  FONT_SCALE_FACTOR: number;
}

// 获取环境变量的辅助函数
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = Constants.expoConfig?.extra?.[key] || process.env[key] || defaultValue;
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
};

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = getEnvVar(key, defaultValue.toString());
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = getEnvVar(key, defaultValue.toString());
  return value.toLowerCase() === 'true';
};

// 环境配置对象
export const env: EnvConfig = {
  // Solana 配置
  SOLANA_RPC_URL: getEnvVar('SOLANA_RPC_URL', 'https://api.devnet.solana.com'),
  WALLET_CONNECT_PROJECT_ID: getEnvVar('WALLET_CONNECT_PROJECT_ID', ''),
  
  // 应用基础信息
  APP_NAME: getEnvVar('APP_NAME', 'OC-Native'),
  APP_VERSION: getEnvVar('APP_VERSION', '1.0.0'),
  
  // API 配置
  API_BASE_URL: getEnvVar('API_BASE_URL', 'https://api.example.com'),
  API_TIMEOUT: getEnvNumber('API_TIMEOUT', 10000),
  API_RETRY_COUNT: getEnvNumber('API_RETRY_COUNT', 3),
  
  // 国际化配置
  DEFAULT_LANGUAGE: getEnvVar('DEFAULT_LANGUAGE', 'en'),
  SUPPORTED_LANGUAGES: getEnvVar('SUPPORTED_LANGUAGES', 'en,zh').split(','),
  
  // 图表配置
  CHART_THEME: getEnvVar('CHART_THEME', 'default'),
  CHART_ANIMATION_DURATION: getEnvNumber('CHART_ANIMATION_DURATION', 1000),
  
  // 存储配置
  MMKV_ENCRYPTION_KEY: getEnvVar('MMKV_ENCRYPTION_KEY', 'default-encryption-key'),
  STORAGE_VERSION: getEnvVar('STORAGE_VERSION', '1.0'),
  CACHE_EXPIRY_TIME: getEnvNumber('CACHE_EXPIRY_TIME', 86400000), // 24小时
  
  // UI 主题配置
  DEFAULT_THEME: getEnvVar('DEFAULT_THEME', 'light') as 'light' | 'dark',
  ENABLE_DARK_MODE: getEnvBoolean('ENABLE_DARK_MODE', true),
  ANIMATION_DURATION: getEnvNumber('ANIMATION_DURATION', 300),
  FONT_SCALE_FACTOR: getEnvNumber('FONT_SCALE_FACTOR', 1.0),
};

// 开发环境检查
export const isDev = __DEV__;
export const isProd = !__DEV__;

// 导出类型
export type { EnvConfig };
