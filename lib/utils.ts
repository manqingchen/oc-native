import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { Buffer } from 'buffer';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import nacl from 'tweetnacl';

/**
 * 钱包错误类定义
 */
export class WalletError extends Error {
  constructor(message: string, public code?: string | number) {
    super(message);
    this.name = 'WalletError';
  }
}

export class ConnectionError extends WalletError {
  constructor(message: string, code?: string | number) {
    super(message, code);
    this.name = 'ConnectionError';
  }
}

export class SigningError extends WalletError {
  constructor(message: string, code?: string | number) {
    super(message, code);
    this.name = 'SigningError';
  }
}

export class TransactionError extends WalletError {
  constructor(message: string, code?: string | number) {
    super(message, code);
    this.name = 'TransactionError';
  }
}

/**
 * 加密工具函数
 */
export const cryptoUtils = {
  /**
   * 解密 Phantom 返回的数据
   */
  decryptPayload: (data: string, nonce: string, sharedSecret: Uint8Array) => {
    try {
      const decryptedData = nacl.box.open.after(
        bs58.decode(data),
        bs58.decode(nonce),
        sharedSecret
      );
      
      if (!decryptedData) {
        throw new SigningError('Unable to decrypt data');
      }
      
      return JSON.parse(Buffer.from(decryptedData).toString('utf8'));
    } catch (error) {
      if (error instanceof SigningError) throw error;
      throw new SigningError(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * 加密要发送给 Phantom 的数据
   */
  encryptPayload: (payload: any, sharedSecret: Uint8Array): [Uint8Array, Uint8Array] => {
    try {
      const nonce = nacl.randomBytes(24);
      const encryptedPayload = nacl.box.after(
        Buffer.from(JSON.stringify(payload)),
        nonce,
        sharedSecret
      );
      
      return [nonce, encryptedPayload];
    } catch (error) {
      throw new SigningError(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * 生成共享密钥
   */
  generateSharedSecret: (phantomPublicKey: string, dappSecretKey: Uint8Array): Uint8Array => {
    try {
      return nacl.box.before(bs58.decode(phantomPublicKey), dappSecretKey);
    } catch (error) {
      throw new ConnectionError(`Failed to generate shared secret: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * 生成新的密钥对
   */
  generateKeyPair: () => {
    return nacl.box.keyPair();
  },
};

/**
 * 地址工具函数
 */
export const addressUtils = {
  /**
   * 验证 Solana 地址格式
   */
  isValidAddress: (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 格式化地址显示（显示前后几位）
   */
  formatAddress: (address: string, startChars = 4, endChars = 4): string => {
    if (!address || address.length <= startChars + endChars) {
      return address;
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  },

  /**
   * 从 base58 字符串创建 PublicKey
   */
  createPublicKey: (address: string): PublicKey => {
    try {
      return new PublicKey(address);
    } catch (error) {
      throw new WalletError(`Invalid public key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

/**
 * URL 工具函数
 */
export const urlUtils = {
  /**
   * 构建 Phantom 深度链接 URL
   */
  buildPhantomUrl: (path: string, params: URLSearchParams, useUniversalLinks = false): string => {
    const baseUrl = useUniversalLinks ? 'https://phantom.app/ul/' : 'phantom://';
    return `${baseUrl}v1/${path}?${params.toString()}`;
  },

  /**
   * 解析深度链接参数
   */
  parseDeepLinkParams: (url: string): URLSearchParams => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams;
    } catch (error) {
      throw new WalletError(`Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  /**
   * 检查是否为错误响应
   */
  isErrorResponse: (params: URLSearchParams): boolean => {
    return params.has('errorCode');
  },

  /**
   * 获取错误信息
   */
  getErrorInfo: (params: URLSearchParams): { code: string; message?: string } => {
    const errorCode = params.get('errorCode') || 'UNKNOWN_ERROR';
    const errorMessage = params.get('errorMessage');
    return { code: errorCode, message: errorMessage || undefined };
  },
};

/**
 * 日志工具函数
 */
export const logUtils = {
  /**
   * 格式化日志消息
   */
  formatLog: (message: string, level: 'info' | 'warn' | 'error' = 'info'): string => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : 'ℹ️';
    return `${prefix} [${timestamp}] ${message}`;
  },

  /**
   * 格式化对象为可读的日志
   */
  formatObject: (obj: any, title?: string): string => {
    const content = JSON.stringify(obj, null, 2);
    return title ? `${title}:\n${content}` : content;
  },

  /**
   * 截断长文本
   */
  truncateText: (text: string, maxLength = 100): string => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  },
};

/**
 * 验证工具函数
 */
export const validationUtils = {
  /**
   * 验证会话数据
   */
  validateSession: (session: any): boolean => {
    return !!(session?.session && session?.publicKey && session?.sharedSecret);
  },

  /**
   * 验证连接数据
   */
  validateConnectData: (data: any): boolean => {
    return !!(data?.session && data?.public_key);
  },

  /**
   * 验证交易数据
   */
  validateTransactionData: (data: any): boolean => {
    return !!(data?.transaction || data?.transactions);
  },

  /**
   * 验证签名数据
   */
  validateSignatureData: (data: any): boolean => {
    return !!(data?.signature);
  },
};

/**
 * 错误处理工具函数
 */
export const errorUtils = {
  /**
   * 创建用户友好的错误消息
   */
  createUserFriendlyError: (error: Error): string => {
    if (error instanceof ConnectionError) {
      return '连接钱包失败，请检查网络连接或重试';
    }
    if (error instanceof TransactionError) {
      return '交易处理失败，请重试';
    }
    if (error instanceof SigningError) {
      return '签名失败，请重试';
    }
    return '操作失败，请重试';
  },

  /**
   * 记录错误详情
   */
  logError: (error: Error, context?: string): void => {
    const contextStr = context ? ` [${context}]` : '';
    console.error(`Wallet Error${contextStr}:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  },

  /**
   * 检查是否为用户取消操作
   */
  isUserCancellation: (error: Error): boolean => {
    const message = error.message.toLowerCase();
    return message.includes('user rejected') || 
           message.includes('user cancelled') || 
           message.includes('user denied');
  },
};

/**
 * 性能工具函数
 */
export const performanceUtils = {
  /**
   * 创建防抖函数
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * 创建节流函数
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
