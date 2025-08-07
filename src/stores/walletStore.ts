/**
 * 钱包状态管理 Store
 * 使用 Zustand 管理跨链钱包状态
 */

import { create } from 'zustand';
import { crossChainWalletManager, type WalletConnectionState } from '../services/crossChainWalletService';
import { getChainConfig, getSupportedChains, type ChainConfig } from '../config/chains';
import { SUPPORTED_WALLETS } from '../config/walletconnect';

// 钱包信息接口
export interface WalletInfo {
  id: string;
  name: string;
  icon?: string;
  isInstalled: boolean;
  supportedChains: string[];
}

// 钱包 Store 状态接口
interface WalletStore {
  // 连接状态
  connectionState: WalletConnectionState;
  isConnecting: boolean;
  error: string | null;
  
  // 链和钱包信息
  supportedChains: ChainConfig[];
  availableWallets: WalletInfo[];
  selectedChain: string | null;
  
  // 余额信息
  balance: string | null;
  isLoadingBalance: boolean;
  
  // Actions
  connectWallet: (chainId?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: string) => Promise<void>;
  selectChain: (chainId: string) => void;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
  
  // 初始化
  initialize: () => void;
}

// 创建 Zustand store
export const useWalletStore = create<WalletStore>()((set, get) => ({
    // 初始状态
    connectionState: {
      isConnected: false,
      address: null,
      chainId: null,
      walletId: null,
      chainType: null,
    },
    isConnecting: false,
    error: null,
    supportedChains: getSupportedChains(true),
    availableWallets: Object.values(SUPPORTED_WALLETS).map(wallet => ({
      id: wallet.id,
      name: wallet.name,
      icon: wallet.metadata?.colors?.primary,
      isInstalled: true, // 在实际应用中需要检测
      supportedChains: [...wallet.chains], // 转换为可变数组
    })),
    selectedChain: null,
    balance: null,
    isLoadingBalance: false,

    // 连接钱包
    connectWallet: async (chainId?: string) => {
      const { selectedChain } = get();
      const targetChainId = chainId || selectedChain;
      
      set({ isConnecting: true, error: null });
      
      try {
        const connectionState = await crossChainWalletManager.connectWallet(targetChainId || undefined);
        
        set({ 
          connectionState,
          isConnecting: false,
          selectedChain: connectionState.chainId,
        });
        
        // 连接成功后刷新余额
        get().refreshBalance();
      } catch (error) {
        console.error('Connect wallet failed:', error);
        set({ 
          isConnecting: false, 
          error: error instanceof Error ? error.message : 'Failed to connect wallet',
        });
      }
    },

    // 断开连接
    disconnect: async () => {
      try {
        await crossChainWalletManager.disconnect();
        
        set({
          connectionState: {
            isConnected: false,
            address: null,
            chainId: null,
            walletId: null,
            chainType: null,
          },
          balance: null,
          error: null,
        });
      } catch (error) {
        console.error('Disconnect failed:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to disconnect',
        });
      }
    },

    // 切换链
    switchChain: async (chainId: string) => {
      const { connectionState } = get();
      
      if (!connectionState.isConnected) {
        set({ error: 'No wallet connected' });
        return;
      }
      
      set({ isConnecting: true, error: null });
      
      try {
        await crossChainWalletManager.switchChain(chainId);
        
        const newConnectionState = crossChainWalletManager.getConnectionState();
        set({ 
          connectionState: newConnectionState,
          selectedChain: chainId,
          isConnecting: false,
          balance: null, // 清除旧链的余额
        });
        
        // 切换链后刷新余额
        get().refreshBalance();
      } catch (error) {
        console.error('Switch chain failed:', error);
        set({ 
          isConnecting: false,
          error: error instanceof Error ? error.message : 'Failed to switch chain',
        });
      }
    },

    // 选择链
    selectChain: (chainId: string) => {
      set({ selectedChain: chainId });
    },

    // 刷新余额
    refreshBalance: async () => {
      const { connectionState } = get();
      
      if (!connectionState.isConnected || !connectionState.address) {
        return;
      }
      
      set({ isLoadingBalance: true });
      
      try {
        // 这里需要根据不同链类型调用不同的余额查询方法
        // 暂时模拟余额数据
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockBalance = '1.234'; // 实际应用中需要调用相应的 RPC
        set({ balance: mockBalance, isLoadingBalance: false });
      } catch (error) {
        console.error('Refresh balance failed:', error);
        set({ 
          isLoadingBalance: false,
          error: error instanceof Error ? error.message : 'Failed to refresh balance',
        });
      }
    },

    // 清除错误
    clearError: () => {
      set({ error: null });
    },

    // 初始化
    initialize: () => {
      // 设置钱包管理器事件监听
      crossChainWalletManager.on('connected', (connectionState: WalletConnectionState) => {
        set({ connectionState });
      });

      crossChainWalletManager.on('disconnected', () => {
        set({
          connectionState: {
            isConnected: false,
            address: null,
            chainId: null,
            walletId: null,
            chainType: null,
          },
          balance: null,
        });
      });

      crossChainWalletManager.on('chainChanged', (chainId: string) => {
        const newConnectionState = crossChainWalletManager.getConnectionState();
        set({ 
          connectionState: newConnectionState,
          selectedChain: chainId,
          balance: null,
        });
        get().refreshBalance();
      });

      crossChainWalletManager.on('accountsChanged', (address: string) => {
        const newConnectionState = crossChainWalletManager.getConnectionState();
        set({ connectionState: newConnectionState });
        get().refreshBalance();
      });

      crossChainWalletManager.on('connectionRestored', (connectionState: WalletConnectionState) => {
        set({ connectionState, selectedChain: connectionState.chainId });
        get().refreshBalance();
      });

      // 获取当前连接状态
      const currentState = crossChainWalletManager.getConnectionState();
      if (currentState.isConnected) {
        set({ 
          connectionState: currentState,
          selectedChain: currentState.chainId,
        });
        get().refreshBalance();
      }
    },
  }));

// 选择器 hooks
export const useWalletConnection = () => useWalletStore(state => ({
  connectionState: state.connectionState,
  isConnecting: state.isConnecting,
  error: state.error,
}));

export const useWalletBalance = () => useWalletStore(state => ({
  balance: state.balance,
  isLoadingBalance: state.isLoadingBalance,
}));

export const useWalletChains = () => useWalletStore(state => ({
  supportedChains: state.supportedChains,
  selectedChain: state.selectedChain,
  selectChain: state.selectChain,
}));

export const useWalletActions = () => useWalletStore(state => ({
  connectWallet: state.connectWallet,
  disconnect: state.disconnect,
  switchChain: state.switchChain,
  refreshBalance: state.refreshBalance,
  clearError: state.clearError,
}));

// 初始化 store (暂时注释掉，避免 Hook 错误)
// useWalletStore.getState().initialize();
