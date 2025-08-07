/**
 * 钱包相关类型定义
 */

import type { Transaction } from '@solana/web3.js';
import type { WalletType, WalletConnectionStatus } from '../config/constants';

// 钱包连接结果
export interface WalletConnectionResult {
  publicKey: string;
  walletType: WalletType;
  success: boolean;
  error?: string;
}

// 钱包状态
export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  walletType: WalletType | null;
  status: WalletConnectionStatus;
  balance: number;
  isLoading: boolean;
  error: string | null;
}

// 钱包配置
export interface WalletConfig {
  autoConnect: boolean;
  network: string;
  endpoint: string;
}

// 交易签名结果
export interface SignTransactionResult {
  signature: string;
  transaction: Transaction;
  success: boolean;
  error?: string;
}

// 钱包事件
export interface WalletEvents {
  connect: (publicKey: string) => void;
  disconnect: () => void;
  accountChanged: (publicKey: string) => void;
  error: (error: Error) => void;
}

// 钱包能力
export interface WalletCapabilities {
  canSignTransaction: boolean;
  canSignMessage: boolean;
  canSignAllTransactions: boolean;
  supportedNetworks: string[];
}

export type { WalletType, WalletConnectionStatus };
