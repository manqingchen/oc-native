/**
 * Expo SecureStore 存储配置
 * 安全的异步本地存储解决方案
 */

import * as SecureStore from 'expo-secure-store';
import { env } from './env';

// 存储键前缀，用于区分不同类型的数据
const STORAGE_PREFIXES = {
  DEFAULT: 'default_',
  USER: 'user_',
  WALLET: 'wallet_',
  CACHE: 'cache_',
} as const;

// 异步存储工具类
export class SecureStorageManager {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  // 生成带前缀的键
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  // 设置值（异步）
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await SecureStore.setItemAsync(this.getKey(key), stringValue);
    } catch (error) {
      console.error(`Error setting storage key ${key}:`, error);
      throw error;
    }
  }

  // 获取值（异步）
  async get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    try {
      const value = await SecureStore.getItemAsync(this.getKey(key));
      if (value === null || value === undefined) {
        return defaultValue;
      }

      // 尝试解析 JSON，如果失败则返回原始字符串
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch (error) {
      console.error(`Error getting storage key ${key}:`, error);
      return defaultValue;
    }
  }

  // 删除值（异步）
  async delete(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.getKey(key));
    } catch (error) {
      console.error(`Error deleting storage key ${key}:`, error);
      throw error;
    }
  }

  // 检查键是否存在（异步）
  async contains(key: string): Promise<boolean> {
    try {
      const value = await SecureStore.getItemAsync(this.getKey(key));
      return value !== null;
    } catch (error) {
      console.error(`Error checking storage key ${key}:`, error);
      return false;
    }
  }

  // 清空当前前缀的所有数据（注意：SecureStore 没有直接的清空方法）
  async clearAll(): Promise<void> {
    try {
      // 由于 SecureStore 没有 getAllKeys 方法，我们需要维护一个键列表
      // 这里简化处理，实际使用中可能需要更复杂的实现
      console.warn('SecureStore does not support clearing all keys. Consider implementing a key registry.');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

// 创建存储管理器实例
export const defaultStorage = new SecureStorageManager(STORAGE_PREFIXES.DEFAULT);
export const userStorageManager = new SecureStorageManager(STORAGE_PREFIXES.USER);
export const walletStorageManager = new SecureStorageManager(STORAGE_PREFIXES.WALLET);
export const cacheStorageManager = new SecureStorageManager(STORAGE_PREFIXES.CACHE);

// 异步缓存管理器
export class AsyncCacheManager {
  private storage: SecureStorageManager;
  private expiryTime: number;

  constructor(storageManager: SecureStorageManager, expiryTime: number = env.CACHE_EXPIRY_TIME) {
    this.storage = storageManager;
    this.expiryTime = expiryTime;
  }

  // 设置缓存（异步）
  async setCache<T>(key: string, value: T, customExpiryTime?: number): Promise<void> {
    const expiryTime = customExpiryTime || this.expiryTime;
    const cacheData = {
      value,
      timestamp: Date.now(),
      expiryTime,
    };
    await this.storage.set(key, cacheData);
  }

  // 获取缓存（异步）
  async getCache<T>(key: string): Promise<T | null> {
    const cacheData = await this.storage.get<{
      value: T;
      timestamp: number;
      expiryTime: number;
    }>(key);

    if (!cacheData) {
      return null;
    }

    const { value, timestamp, expiryTime } = cacheData;
    const now = Date.now();

    // 检查是否过期
    if (now - timestamp > expiryTime) {
      await this.storage.delete(key);
      return null;
    }

    return value;
  }

  // 清除过期缓存（简化版本，因为 SecureStore 没有 getAllKeys）
  async clearExpiredCache(): Promise<void> {
    // 由于 SecureStore 的限制，这里只能提供一个占位实现
    // 实际使用中可能需要维护一个键的注册表
    console.warn('SecureStore does not support getting all keys. Consider implementing a key registry for cache management.');
  }
}

// 创建缓存管理器实例
export const cacheManager = new AsyncCacheManager(cacheStorageManager);
