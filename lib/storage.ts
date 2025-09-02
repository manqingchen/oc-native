import * as SecureStore from 'expo-secure-store';

// 存储键常量
export const STORAGE_KEYS = {
  DAPP_KEY_PAIR: 'dapp_key_pair',
  SHARED_SECRET: 'shared_secret',
  SESSION: 'session',
  PHANTOM_WALLET_PUBLIC_KEY: 'phantom_wallet_public_key',
  LOGS: 'logs',
} as const;

// 类型定义
export interface StoredKeyPair {
  publicKey: string; // base58 encoded
  secretKey: string; // base58 encoded
}

export interface WalletSession {
  session: string;
  publicKey: string;
  sharedSecret: string;
}

// 存储大小检查工具
const checkStorageSize = (key: string, value: string): boolean => {
  const size = new Blob([value]).size;
  if (size > 2000) { // 留一些余量
    console.warn(`Storage value for ${key} is ${size} bytes, which may exceed SecureStore limit`);
    return false;
  }
  return true;
};

// 安全存储函数
const safeSetItem = async (key: string, value: string): Promise<void> => {
  if (!checkStorageSize(key, value)) {
    throw new Error(`Value too large for key: ${key}`);
  }
  await SecureStore.setItemAsync(key, value);
};

// 存储工具函数
export const storageUtils = {
  // 存储 dApp 密钥对
  setDappKeyPair: async (keyPair: StoredKeyPair) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.DAPP_KEY_PAIR, JSON.stringify(keyPair));
  },

  // 获取 dApp 密钥对
  getDappKeyPair: async (): Promise<StoredKeyPair | null> => {
    try {
      const stored = await SecureStore.getItemAsync(STORAGE_KEYS.DAPP_KEY_PAIR);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get dApp key pair:', error);
      return null;
    }
  },

  // 存储钱包会话
  setWalletSession: async (session: WalletSession) => {
    try {
      await Promise.all([
        SecureStore.setItemAsync(STORAGE_KEYS.SESSION, session.session),
        SecureStore.setItemAsync(STORAGE_KEYS.PHANTOM_WALLET_PUBLIC_KEY, session.publicKey),
        SecureStore.setItemAsync(STORAGE_KEYS.SHARED_SECRET, session.sharedSecret),
      ]);
    } catch (error) {
      console.error('Failed to set wallet session:', error);
    }
  },

  // 获取钱包会话
  getWalletSession: async (): Promise<WalletSession | null> => {
    try {
      const [session, publicKey, sharedSecret] = await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.SESSION),
        SecureStore.getItemAsync(STORAGE_KEYS.PHANTOM_WALLET_PUBLIC_KEY),
        SecureStore.getItemAsync(STORAGE_KEYS.SHARED_SECRET),
      ]);

      if (session && publicKey && sharedSecret) {
        return { session, publicKey, sharedSecret };
      }
      return null;
    } catch (error) {
      console.error('Failed to get wallet session:', error);
      return null;
    }
  },

  // 清除钱包会话
  clearWalletSession: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION),
        SecureStore.deleteItemAsync(STORAGE_KEYS.PHANTOM_WALLET_PUBLIC_KEY),
        SecureStore.deleteItemAsync(STORAGE_KEYS.SHARED_SECRET),
      ]);
    } catch (error) {
      console.error('Failed to clear wallet session:', error);
    }
  },

  // 日志不存储到 SecureStore，只保存在内存中
  setLogs: async (logs: string[]) => {
    // 日志只保存在内存中，不持久化
    // 这样避免 SecureStore 的大小限制问题
    return Promise.resolve();
  },

  // 获取日志 - 返回空数组，因为不持久化
  getLogs: async (): Promise<string[]> => {
    return Promise.resolve([]);
  },

  // 清除日志
  clearLogs: async () => {
    return Promise.resolve();
  },

  // 清除所有数据
  clearAll: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.DAPP_KEY_PAIR),
        SecureStore.deleteItemAsync(STORAGE_KEYS.SESSION),
        SecureStore.deleteItemAsync(STORAGE_KEYS.PHANTOM_WALLET_PUBLIC_KEY),
        SecureStore.deleteItemAsync(STORAGE_KEYS.SHARED_SECRET),
        // 不需要清理 LOGS，因为不存储
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  },
};
