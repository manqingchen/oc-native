/**
 * 应用常量定义
 * 所有硬编码的常量都在这里统一管理
 */

// 存储键名常量
export const STORAGE_KEYS = {
  // 用户相关
  USER_SETTINGS: 'user_settings',
  WALLET_CONFIG: 'wallet_config',
  LANGUAGE_PREFERENCE: 'language_preference',
  THEME_PREFERENCE: 'theme_preference',
  
  // 钱包相关
  CONNECTED_WALLETS: 'connected_wallets',
  WALLET_ADDRESSES: 'wallet_addresses',
  LAST_CONNECTED_WALLET: 'last_connected_wallet',
  
  // 应用状态
  APP_STATE: 'app_state',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  FIRST_LAUNCH: 'first_launch',
  
  // 缓存
  API_CACHE: 'api_cache',
  CHART_DATA_CACHE: 'chart_data_cache',
} as const;

// 钱包类型常量
export const WALLET_TYPES = {
  PHANTOM: 'phantom',
  METAMASK: 'metamask',
  OKX: 'okx',
} as const;

// 网络常量
export const NETWORKS = {
  MAINNET: 'mainnet-beta',
  DEVNET: 'devnet',
  TESTNET: 'testnet',
} as const;

// API 端点常量
export const API_ENDPOINTS = {
  // Solana 相关
  SOLANA_BALANCE: '/solana/balance',
  SOLANA_TRANSACTIONS: '/solana/transactions',
  SOLANA_TOKENS: '/solana/tokens',
  
  // 图表数据
  CHART_DATA: '/charts/data',
  PRICE_DATA: '/charts/prices',
  VOLUME_DATA: '/charts/volume',
  
  // 用户相关
  USER_PROFILE: '/user/profile',
  USER_SETTINGS: '/user/settings',
} as const;

// 图表类型常量
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  CANDLESTICK: 'candlestick',
  AREA: 'area',
} as const;

// 主题常量
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// 语言常量
export const LANGUAGES = {
  ENGLISH: 'en',
  CHINESE: 'zh',
} as const;

// 错误类型常量
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  WALLET_ERROR: 'WALLET_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

// 钱包连接状态
export const WALLET_CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const;

// 应用状态常量
export const APP_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
  MAINTENANCE: 'maintenance',
} as const;

// 动画持续时间常量
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// 屏幕尺寸断点
export const BREAKPOINTS = {
  SMALL: 576,
  MEDIUM: 768,
  LARGE: 992,
  EXTRA_LARGE: 1200,
} as const;

// 导出类型
export type StorageKey = keyof typeof STORAGE_KEYS;
export type WalletType = typeof WALLET_TYPES[keyof typeof WALLET_TYPES];
export type NetworkType = typeof NETWORKS[keyof typeof NETWORKS];
export type ChartType = typeof CHART_TYPES[keyof typeof CHART_TYPES];
export type ThemeType = typeof THEMES[keyof typeof THEMES];
export type LanguageType = typeof LANGUAGES[keyof typeof LANGUAGES];
export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];
export type WalletConnectionStatus = typeof WALLET_CONNECTION_STATUS[keyof typeof WALLET_CONNECTION_STATUS];
export type AppState = typeof APP_STATES[keyof typeof APP_STATES];
