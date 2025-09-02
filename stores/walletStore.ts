import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { PublicKey, Transaction, Connection, clusterApiUrl } from '@solana/web3.js';

// 钱包状态类型
export type WalletStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// 钱包信息接口
export interface WalletInfo {
  address: string | null;
  publicKey: PublicKey | null;
  status: WalletStatus;
  isConnected: boolean;
}

// 钱包操作接口
export interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAndSendTransaction: (transaction: Transaction) => Promise<string>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
}

// Zustand Store 接口
interface WalletStore extends WalletInfo, WalletActions {
  error: string | null;
  connection: Connection;
  isInitialized: boolean;

  // 内部状态管理
  setError: (error: string | null) => void;
  setWalletInfo: (info: Partial<WalletInfo>) => void;
  setStatus: (status: WalletStatus) => void;

  // 同步已保存的钱包地址
  syncSavedWallet: (address: string) => void;

  // 清除钱包状态
  clearWalletState: () => void;

  // 初始化方法
  initialize: (redirectUri?: string) => void;

  // Phantom 连接器实例（内部使用）
  _phantomConnector: any;
  _setPhantomConnector: (connector: any) => void;
}

// 创建 Zustand Store
export const useWalletStore = create<WalletStore>()(
  subscribeWithSelector((set, get) => ({
    // 钱包信息状态
    address: null,
    publicKey: null,
    status: 'disconnected',
    isConnected: false,
    error: null,
    isInitialized: false,

    // Solana 连接
    connection: new Connection(clusterApiUrl('devnet'), 'confirmed'),

    // 内部状态
    _phantomConnector: null,

    // 状态更新方法
    setError: (error) => set({ error }),

    setWalletInfo: (info) => set((state) => ({
      ...state,
      ...info,
      publicKey: info.address ? new PublicKey(info.address) : state.publicKey,
    })),

    setStatus: (status) => set({ status }),

    // 同步已保存的钱包地址（用于从本地存储恢复状态）
    syncSavedWallet: (address) => set((state) => ({
      address,
      publicKey: new PublicKey(address),
      status: 'connected' as WalletStatus,
      isConnected: true,
    })),

    // 清除钱包状态（用于登出）
    clearWalletState: () => set({
      address: null,
      publicKey: null,
      status: 'disconnected' as WalletStatus,
      isConnected: false,
      error: null,
    }),

    _setPhantomConnector: (connector) => set({ _phantomConnector: connector }),

    // 初始化方法
    initialize: () => {
      const state = get();
      if (state.isInitialized) return;

      // 这里不能直接调用 hook，需要在组件中调用
      set({ isInitialized: true });
    },

    // 钱包操作方法（这些会在组件中被实际的 phantom 方法覆盖）
    connect: async () => {
      const state = get();
      if (!state._phantomConnector) {
        throw new Error('Wallet not initialized');
      }

      try {
        set({ error: null, status: 'connecting' });
        await state._phantomConnector.connect();
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to connect wallet';
        set({ error: errorMessage, status: 'error' });
        throw new Error(errorMessage);
      }
    },

    disconnect: () => {
      const state = get();
      if (!state._phantomConnector) return;

      try {
        set({ error: null });
        state._phantomConnector.disconnect();
        set({
          address: null,
          publicKey: null,
          status: 'disconnected',
          isConnected: false,
        });
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to disconnect wallet';
        set({ error: errorMessage });
      }
    },

    signMessage: async (message: string) => {
      const state = get();
      console.log('🔍 Store signMessage 开始, 状态:', {
        hasConnector: !!state._phantomConnector,
        isConnected: state.isConnected,
        status: state.status,
        address: state.address
      });

      if (!state._phantomConnector) {
        console.log('❌ Phantom 连接器未初始化');
        throw new Error('Wallet not initialized');
      }

      // 检查钱包是否已连接
      if (!state.isConnected || state.status !== 'connected') {
        console.log('❌ 钱包未连接或状态不正确');
        throw new Error(`Wallet not connected. Status: ${state.status}, Connected: ${state.isConnected}`);
      }

      console.log('✅ 开始调用 phantom.signMessage');
      try {
        set({ error: null });
        const result = await state._phantomConnector.signMessage(message);
        console.log('✅ Phantom signMessage 成功:', result);
        return result;
      } catch (err: any) {
        console.error('❌ Phantom signMessage 失败:', err);
        const errorMessage = err.message || 'Failed to sign message';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
    },

    signTransaction: async (transaction: Transaction) => {
      const state = get();
      if (!state._phantomConnector) {
        throw new Error('Wallet not initialized');
      }

      console.log('✅ 开始调用 phantom.signTransaction');
      try {
        set({ error: null });
        console.log('phantom.signTransaction transaction ===================>>>>>>>>>>> ', transaction);
        const result = await state._phantomConnector.signTransaction(transaction);
        console.log('phantom.signTransaction result ===================>>>>>>>>>>> ', result);
        return (result as any).transaction || (result as unknown as Transaction);
      } catch (err: any) {
        const {_phantomConnector} = get()
        console.log('_phantomConnector', _phantomConnector)
        console.log('❌ phantom.signTransaction 失败:', err);
        const errorMessage = err.message || 'Failed to sign transaction';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
    },

    signAndSendTransaction: async (transaction: Transaction) => {
      const state = get();
      if (!state._phantomConnector) {
        throw new Error('Wallet not initialized');
      }

      try {
        set({ error: null });
        const result = await state._phantomConnector.signAndSendTransaction(transaction);
        return typeof result === 'string' ? result : result.signature || result.toString();
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to sign and send transaction';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
    },

    signAllTransactions: async (transactions: Transaction[]) => {
      const state = get();
      if (!state._phantomConnector) {
        throw new Error('Wallet not initialized');
      }

      try {
        set({ error: null });
        const result = await state._phantomConnector.signAllTransactions(transactions);
        return (result as any).transactions || (result as unknown as Transaction[]);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to sign transactions';
        set({ error: errorMessage });
        throw new Error(errorMessage);
      }
    },
  }))
);
