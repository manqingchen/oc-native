/**
 * 跨链钱包服务
 * 统一管理多链多钱包的连接和操作
 */

import { WalletConnectModal } from '@walletconnect/modal-react-native';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { WALLETCONNECT_CONFIG, WALLET_CONNECT_OPTIONS, SESSION_CONFIG } from '../config/walletconnect';
import { ChainType, getChainType, getChainConfig } from '../config/chains';
import { walletStorageManager } from '../config/storage';
import type { ChainConfig } from '../config/chains';

// 钱包连接状态
export interface WalletConnectionState {
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  walletId: string | null;
  chainType: ChainType | null;
}

// 跨链钱包管理器
export class CrossChainWalletManager {
  private modal: WalletConnectModal | null = null;
  private ethereumProvider: EthereumProvider | null = null;
  private solanaProvider: any = null; // Solana WalletConnect provider
  private connectionState: WalletConnectionState = {
    isConnected: false,
    address: null,
    chainId: null,
    walletId: null,
    chainType: null,
  };
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeProviders();
    this.loadSavedConnection(); // 异步调用，不等待
  }

  // 初始化提供者
  private async initializeProviders() {
    try {
      // 初始化 WalletConnect Modal
      this.modal = new WalletConnectModal({
        projectId: WALLETCONNECT_CONFIG.projectId,
        metadata: WALLETCONNECT_CONFIG.metadata,
        ...WALLET_CONNECT_OPTIONS,
      });

      // 初始化 Ethereum Provider
      this.ethereumProvider = await EthereumProvider.init({
        projectId: WALLETCONNECT_CONFIG.projectId,
        metadata: WALLETCONNECT_CONFIG.metadata,
        chains: ['1', '56'], // Ethereum, BSC
        showQrModal: false,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize providers:', error);
    }
  }

  // 设置事件监听器
  private setupEventListeners() {
    if (this.ethereumProvider) {
      this.ethereumProvider.on('accountsChanged', this.handleAccountsChanged.bind(this));
      this.ethereumProvider.on('chainChanged', this.handleChainChanged.bind(this));
      this.ethereumProvider.on('disconnect', this.handleDisconnect.bind(this));
    }
  }

  // 加载保存的连接（异步）
  private async loadSavedConnection() {
    try {
      const savedConnection = await walletStorageManager.get<WalletConnectionState>('wallet_connection');
      if (savedConnection && savedConnection.isConnected) {
        this.connectionState = savedConnection;
        this.emit('connectionRestored', savedConnection);
      }
    } catch (error) {
      console.error('Failed to load saved connection:', error);
    }
  }

  // 保存连接状态（异步）
  private async saveConnection() {
    try {
      await walletStorageManager.set('wallet_connection', this.connectionState);
    } catch (error) {
      console.error('Failed to save connection:', error);
    }
  }

  // 连接钱包
  async connectWallet(chainId?: string): Promise<WalletConnectionState> {
    try {
      const chainType = chainId ? getChainType(chainId) : null;
      
      if (chainType === ChainType.SOLANA) {
        return await this.connectSolanaWallet(chainId);
      } else {
        return await this.connectEthereumWallet(chainId);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  // 连接 Solana 钱包
  private async connectSolanaWallet(chainId?: string): Promise<WalletConnectionState> {
    try {
      if (!this.modal) {
        throw new Error('WalletConnect modal not initialized');
      }

      // 打开钱包选择模态框
      const { uri, approval } = await this.modal.connect({
        requiredNamespaces: {
          solana: SESSION_CONFIG.requiredNamespaces.solana,
        },
      });

      if (uri) {
        // 显示二维码或深度链接
        console.log('WalletConnect URI:', uri);
      }

      // 等待用户批准连接
      const session = await approval();
      
      if (session) {
        const accounts = session.namespaces.solana?.accounts || [];
        if (accounts.length > 0) {
          const address = accounts[0].split(':')[2]; // 提取地址部分
          
          this.connectionState = {
            isConnected: true,
            address,
            chainId: chainId || 'solana:devnet',
            walletId: 'phantom', // 可以从会话中获取
            chainType: ChainType.SOLANA,
          };

          this.saveConnection();
          this.emit('connected', this.connectionState);
          return this.connectionState;
        }
      }

      throw new Error('Failed to connect Solana wallet');
    } catch (error) {
      console.error('Solana wallet connection failed:', error);
      throw error;
    }
  }

  // 连接 Ethereum 钱包
  private async connectEthereumWallet(chainId?: string): Promise<WalletConnectionState> {
    try {
      if (!this.ethereumProvider) {
        throw new Error('Ethereum provider not initialized');
      }

      // 连接钱包
      const accounts = await this.ethereumProvider.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        const currentChainId = await this.ethereumProvider.request({
          method: 'eth_chainId',
        });

        this.connectionState = {
          isConnected: true,
          address,
          chainId: `eip155:${parseInt(currentChainId, 16)}`,
          walletId: 'metamask', // 可以从提供者中获取
          chainType: ChainType.ETHEREUM,
        };

        this.saveConnection();
        this.emit('connected', this.connectionState);
        return this.connectionState;
      }

      throw new Error('No accounts found');
    } catch (error) {
      console.error('Ethereum wallet connection failed:', error);
      throw error;
    }
  }

  // 断开连接
  async disconnect(): Promise<void> {
    try {
      if (this.ethereumProvider && this.connectionState.chainType !== ChainType.SOLANA) {
        await this.ethereumProvider.disconnect();
      }

      if (this.modal && this.connectionState.chainType === ChainType.SOLANA) {
        await this.modal.disconnect();
      }

      this.connectionState = {
        isConnected: false,
        address: null,
        chainId: null,
        walletId: null,
        chainType: null,
      };

      await walletStorageManager.delete('wallet_connection');
      this.emit('disconnected');
    } catch (error) {
      console.error('Failed to disconnect:', error);
      throw error;
    }
  }

  // 切换链
  async switchChain(chainId: string): Promise<void> {
    const chainConfig = getChainConfig(chainId);
    if (!chainConfig) {
      throw new Error(`Unsupported chain: ${chainId}`);
    }

    const chainType = getChainType(chainId);
    
    if (chainType === ChainType.ETHEREUM || chainType === ChainType.BSC) {
      await this.switchEthereumChain(chainConfig);
    } else if (chainType === ChainType.SOLANA) {
      // Solana 链切换逻辑
      this.connectionState.chainId = chainId;
      this.saveConnection();
      this.emit('chainChanged', chainId);
    }
  }

  // 切换 Ethereum 链
  private async switchEthereumChain(chainConfig: ChainConfig): Promise<void> {
    if (!this.ethereumProvider) {
      throw new Error('Ethereum provider not available');
    }

    const chainIdHex = `0x${parseInt(chainConfig.id.split(':')[1]).toString(16)}`;

    try {
      await this.ethereumProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (error: any) {
      // 如果链不存在，尝试添加
      if (error.code === 4902) {
        await this.ethereumProvider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chainIdHex,
            chainName: chainConfig.displayName,
            nativeCurrency: chainConfig.nativeCurrency,
            rpcUrls: chainConfig.rpcUrls,
            blockExplorerUrls: chainConfig.blockExplorerUrls,
          }],
        });
      } else {
        throw error;
      }
    }
  }

  // 获取当前连接状态
  getConnectionState(): WalletConnectionState {
    return { ...this.connectionState };
  }

  // 检查是否已连接
  isConnected(): boolean {
    return this.connectionState.isConnected;
  }

  // 获取当前地址
  getCurrentAddress(): string | null {
    return this.connectionState.address;
  }

  // 获取当前链ID
  getCurrentChainId(): string | null {
    return this.connectionState.chainId;
  }

  // 事件处理器
  private handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      this.disconnect();
    } else {
      this.connectionState.address = accounts[0];
      this.saveConnection();
      this.emit('accountsChanged', accounts[0]);
    }
  }

  private handleChainChanged(chainId: string) {
    const formattedChainId = `eip155:${parseInt(chainId, 16)}`;
    this.connectionState.chainId = formattedChainId;
    this.connectionState.chainType = getChainType(formattedChainId) || null;
    this.saveConnection();
    this.emit('chainChanged', formattedChainId);
  }

  private handleDisconnect() {
    this.disconnect();
  }

  // 事件系统
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }
}

// 创建全局实例
export const crossChainWalletManager = new CrossChainWalletManager();

// 导出类型
export type { WalletConnectionState };
