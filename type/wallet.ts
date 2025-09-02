/**
 * 钱包相关类型定义和错误类
 */

// 钱包错误基类
export class WalletError extends Error {
  constructor(message: string, public code?: string | number) {
    super(message);
    this.name = 'WalletError';
  }
}

// 连接错误
export class ConnectionError extends WalletError {
  constructor(message: string, code?: string | number) {
    super(message, code);
    this.name = 'ConnectionError';
  }
}

// 签名错误
export class SigningError extends WalletError {
  constructor(message: string, code?: string | number) {
    super(message, code);
    this.name = 'SigningError';
  }
}

// 交易错误
export class TransactionError extends WalletError {
  constructor(message: string, code?: string | number) {
    super(message, code);
    this.name = 'TransactionError';
  }
}

// 钱包状态类型
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// 钱包连接状态
export interface WalletConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  publicKey: string | null;
  status: WalletStatus;
  error: string | null;
}

// 钱包操作结果
export interface WalletOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string | number;
}

// 签名响应
export interface SignMessageResponse {
  signature: string;
  publicKey: string;
}

// 交易签名响应
export interface SignTransactionResponse {
  signature: string;
  transaction: string; // base64 encoded
}

// 钱包适配器接口
export interface WalletAdapter {
  name: string;
  icon: string;
  url: string;
  isInstalled: boolean;
  connect(): Promise<WalletConnectionState>;
  disconnect(): Promise<void>;
  signMessage(message: string): Promise<SignMessageResponse>;
  signTransaction(transaction: any): Promise<SignTransactionResponse>;
}

// 钱包事件类型
export type WalletEventType = 
  | 'connect'
  | 'disconnect' 
  | 'accountChanged'
  | 'error';

// 钱包事件数据
export interface WalletEvent {
  type: WalletEventType;
  data?: any;
  error?: Error;
}

// 钱包配置
export interface WalletConfig {
  autoConnect?: boolean;
  network?: string;
  endpoint?: string;
  commitment?: string;
}
