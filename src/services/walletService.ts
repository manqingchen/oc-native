/**
 * 钱包服务
 * 处理多钱包连接和管理
 */

import { PublicKey, Transaction } from '@solana/web3.js';
import { WALLET_TYPES, WALLET_CONNECTION_STATUS } from '../config/constants';
import { walletStorageManager } from '../config/storage';
import type { WalletType, WalletConnectionStatus } from '../config/constants';

// 钱包信息接口
export interface WalletInfo {
  type: WalletType;
  name: string;
  icon: string;
  publicKey?: string;
  status: WalletConnectionStatus;
  isInstalled: boolean;
  deepLink?: string;
}

// 钱包适配器接口
export interface WalletAdapter {
  connect(): Promise<{ publicKey: string }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  isConnected(): boolean;
  getPublicKey(): string | null;
}

// 钱包管理器
export class WalletManager {
  private adapters: Map<WalletType, WalletAdapter> = new Map();
  private currentWallet: WalletType | null = null;
  private walletInfos: Map<WalletType, WalletInfo> = new Map();

  constructor() {
    this.initializeWalletInfos();
    this.loadSavedWalletState();
  }

  // 初始化钱包信息
  private initializeWalletInfos(): void {
    this.walletInfos.set(WALLET_TYPES.PHANTOM, {
      type: WALLET_TYPES.PHANTOM,
      name: 'Phantom',
      icon: 'phantom-icon',
      status: WALLET_CONNECTION_STATUS.DISCONNECTED,
      isInstalled: this.checkWalletInstallation(WALLET_TYPES.PHANTOM),
      deepLink: 'phantom://',
    });

    this.walletInfos.set(WALLET_TYPES.METAMASK, {
      type: WALLET_TYPES.METAMASK,
      name: 'MetaMask',
      icon: 'metamask-icon',
      status: WALLET_CONNECTION_STATUS.DISCONNECTED,
      isInstalled: this.checkWalletInstallation(WALLET_TYPES.METAMASK),
      deepLink: 'metamask://',
    });

    this.walletInfos.set(WALLET_TYPES.OKX, {
      type: WALLET_TYPES.OKX,
      name: 'OKX Wallet',
      icon: 'okx-icon',
      status: WALLET_CONNECTION_STATUS.DISCONNECTED,
      isInstalled: this.checkWalletInstallation(WALLET_TYPES.OKX),
      deepLink: 'okx://',
    });
  }

  // 检查钱包是否已安装
  private checkWalletInstallation(walletType: WalletType): boolean {
    // 在实际实现中，这里会检查钱包是否已安装
    // 对于移动端，通常通过检查 deep link 或 SDK 可用性
    return true; // 暂时返回 true
  }

  // 加载保存的钱包状态
  private loadSavedWalletState(): void {
    const savedWallet = walletStorageManager.get<WalletType>('last_connected_wallet');
    if (savedWallet) {
      this.currentWallet = savedWallet;
    }
  }

  // 保存钱包状态
  private saveWalletState(): void {
    if (this.currentWallet) {
      walletStorageManager.set('last_connected_wallet', this.currentWallet);
    }
  }

  // 注册钱包适配器
  registerAdapter(walletType: WalletType, adapter: WalletAdapter): void {
    this.adapters.set(walletType, adapter);
  }

  // 获取所有可用钱包
  getAvailableWallets(): WalletInfo[] {
    return Array.from(this.walletInfos.values());
  }

  // 获取当前连接的钱包
  getCurrentWallet(): WalletInfo | null {
    if (!this.currentWallet) return null;
    return this.walletInfos.get(this.currentWallet) || null;
  }

  // 连接钱包
  async connectWallet(walletType: WalletType): Promise<WalletInfo> {
    const adapter = this.adapters.get(walletType);
    const walletInfo = this.walletInfos.get(walletType);

    if (!adapter) {
      throw new Error(`Adapter for ${walletType} not found`);
    }

    if (!walletInfo) {
      throw new Error(`Wallet info for ${walletType} not found`);
    }

    if (!walletInfo.isInstalled) {
      throw new Error(`${walletInfo.name} is not installed`);
    }

    try {
      // 更新状态为连接中
      this.updateWalletStatus(walletType, WALLET_CONNECTION_STATUS.CONNECTING);

      // 连接钱包
      const result = await adapter.connect();

      // 更新钱包信息
      const updatedWalletInfo = {
        ...walletInfo,
        publicKey: result.publicKey,
        status: WALLET_CONNECTION_STATUS.CONNECTED,
      };

      this.walletInfos.set(walletType, updatedWalletInfo);
      this.currentWallet = walletType;
      this.saveWalletState();

      return updatedWalletInfo;
    } catch (error) {
      // 更新状态为错误
      this.updateWalletStatus(walletType, WALLET_CONNECTION_STATUS.ERROR);
      throw error;
    }
  }

  // 断开钱包连接
  async disconnectWallet(walletType?: WalletType): Promise<void> {
    const targetWallet = walletType || this.currentWallet;
    if (!targetWallet) return;

    const adapter = this.adapters.get(targetWallet);
    if (adapter) {
      try {
        await adapter.disconnect();
      } catch (error) {
        console.error(`Error disconnecting ${targetWallet}:`, error);
      }
    }

    // 更新状态
    this.updateWalletStatus(targetWallet, WALLET_CONNECTION_STATUS.DISCONNECTED);

    // 清除公钥
    const walletInfo = this.walletInfos.get(targetWallet);
    if (walletInfo) {
      this.walletInfos.set(targetWallet, {
        ...walletInfo,
        publicKey: undefined,
      });
    }

    // 如果是当前钱包，清除当前钱包
    if (targetWallet === this.currentWallet) {
      this.currentWallet = null;
      walletStorageManager.delete('last_connected_wallet');
    }
  }

  // 断开所有钱包
  async disconnectAllWallets(): Promise<void> {
    const connectedWallets = Array.from(this.walletInfos.entries())
      .filter(([_, info]) => info.status === WALLET_CONNECTION_STATUS.CONNECTED)
      .map(([type, _]) => type);

    await Promise.all(
      connectedWallets.map(walletType => this.disconnectWallet(walletType))
    );
  }

  // 更新钱包状态
  private updateWalletStatus(walletType: WalletType, status: WalletConnectionStatus): void {
    const walletInfo = this.walletInfos.get(walletType);
    if (walletInfo) {
      this.walletInfos.set(walletType, {
        ...walletInfo,
        status,
      });
    }
  }

  // 签名交易
  async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this.currentWallet) {
      throw new Error('No wallet connected');
    }

    const adapter = this.adapters.get(this.currentWallet);
    if (!adapter) {
      throw new Error('Wallet adapter not found');
    }

    return adapter.signTransaction(transaction);
  }

  // 签名多个交易
  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    if (!this.currentWallet) {
      throw new Error('No wallet connected');
    }

    const adapter = this.adapters.get(this.currentWallet);
    if (!adapter) {
      throw new Error('Wallet adapter not found');
    }

    return adapter.signAllTransactions(transactions);
  }

  // 签名消息
  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this.currentWallet) {
      throw new Error('No wallet connected');
    }

    const adapter = this.adapters.get(this.currentWallet);
    if (!adapter) {
      throw new Error('Wallet adapter not found');
    }

    return adapter.signMessage(message);
  }

  // 检查是否已连接
  isConnected(): boolean {
    if (!this.currentWallet) return false;

    const adapter = this.adapters.get(this.currentWallet);
    return adapter ? adapter.isConnected() : false;
  }

  // 获取当前公钥
  getCurrentPublicKey(): string | null {
    if (!this.currentWallet) return null;

    const adapter = this.adapters.get(this.currentWallet);
    return adapter ? adapter.getPublicKey() : null;
  }
}

// 创建全局钱包管理器实例
export const walletManager = new WalletManager();

// 导出类型
export type { WalletType, WalletConnectionStatus, WalletInfo, WalletAdapter };
