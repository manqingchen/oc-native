import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { create } from 'zustand';
import { RPC_URL, RPC_WS_URL } from './config';
import { storageUtils } from './storage';

// 余额信息类型
export interface WalletBalance {
  raw: number;      // 原始数量（最小单位）
  usdc: number;     // USDC 数量（带小数）
  decimals: number; // 小数位数
}

// 状态类型定义
export interface WalletState {
  // Solana 连接
  connection: Connection;

  // 连接状态
  isConnected: boolean;
  isConnecting: boolean;

  // 密钥和会话
  dappKeyPair: nacl.BoxKeyPair | null;
  sharedSecret: Uint8Array | null;
  session: string | null;
  phantomWalletPublicKey: PublicKey | null;

  // 余额信息
  balance: WalletBalance | null;
  isLoadingBalance: boolean;

  // 日志
  logs: string[];

  // 深度链接
  deepLink: string;

  // 签名上下文（用于钱包认证）
  signatureContext: {
    message: string;
    walletAddress: PublicKey;
  } | null;

  // 签名响应处理器
  signatureResponseHandlers: Map<string, (response: any) => void>;
}

export interface WalletActions {
  // 连接管理
  reinitializeConnection: () => void;

  // 连接相关
  setConnecting: (connecting: boolean) => void;
  setConnected: (connected: boolean) => void;

  // 会话管理
  setWalletSession: (session: string, publicKey: PublicKey, sharedSecret: Uint8Array) => Promise<void>;
  clearWalletSession: () => Promise<void>;
  loadStoredSession: () => Promise<void>;

  // 密钥管理
  initializeDappKeyPair: () => Promise<void>;

  // 余额管理
  setBalance: (balance: WalletBalance | null) => void;
  setLoadingBalance: (loading: boolean) => void;

  // 账户切换处理
  handleAccountSwitch: () => Promise<void>;
  refreshConnection: () => Promise<void>;

  // 日志管理
  addLog: (log: string) => void;
  clearLogs: () => void;
  loadStoredLogs: () => Promise<void>;

  // 深度链接
  setDeepLink: (url: string) => void;

  // 签名上下文管理
  setSignatureContext: (message: string, walletAddress: PublicKey) => void;
  clearSignatureContext: () => void;

  // 签名响应处理
  registerSignatureHandler: (id: string, handler: (response: any) => void) => void;
  unregisterSignatureHandler: (id: string) => void;
  handleSignatureResponse: (id: string, response: any) => void;

  // 初始化
  initialize: () => Promise<void>;
}

export type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Solana 连接实例
  connection: new Connection(RPC_URL, {
    wsEndpoint: RPC_WS_URL,
    commitment: 'confirmed',
  }),

  // 初始状态
  isConnected: false,
  isConnecting: false,
  dappKeyPair: null,
  sharedSecret: null,
  session: null,
  phantomWalletPublicKey: null,
  balance: null,
  isLoadingBalance: false,
  logs: [],
  deepLink: '',
  signatureContext: null,
  signatureResponseHandlers: new Map(),

  // Actions
  reinitializeConnection: () => {
    const newConnection = new Connection(RPC_URL, {
      wsEndpoint: RPC_WS_URL,
      commitment: 'confirmed',
    });
    set({ connection: newConnection });
    console.log('🔄 Connection reinitialized with current environment settings');
  },

  setConnecting: (connecting) => set({ isConnecting: connecting }),
  
  setConnected: (connected) => set({ isConnected: connected }),

  setWalletSession: async (session, publicKey, sharedSecret) => {
    // 保存到状态
    set({
      session,
      phantomWalletPublicKey: publicKey,
      sharedSecret,
      isConnected: true,
      isConnecting: false,
    });

    // 持久化存储
    try {
      await storageUtils.setWalletSession({
        session,
        publicKey: publicKey.toBase58(),
        sharedSecret: bs58.encode(sharedSecret),
      });
    } catch (error) {
      console.error('Failed to persist wallet session:', error);
    }
  },

  clearWalletSession: async () => {
    set({
      session: null,
      phantomWalletPublicKey: null,
      sharedSecret: null,
      isConnected: false,
      isConnecting: false,
      balance: null,
      isLoadingBalance: false,
      signatureContext: null, // 清除签名上下文
    });

    try {
      await storageUtils.clearWalletSession();
    } catch (error) {
      console.error('Failed to clear wallet session:', error);
    }
  },

  loadStoredSession: async () => {
    try {
      const stored = await storageUtils.getWalletSession();
      if (stored) {
        const publicKey = new PublicKey(stored.publicKey);
        const sharedSecret = bs58.decode(stored.sharedSecret);

        set({
          session: stored.session,
          phantomWalletPublicKey: publicKey,
          sharedSecret,
          isConnected: true,
        });
      }
    } catch (error) {
      console.error('Failed to load stored session:', error);
      await storageUtils.clearWalletSession();
    }
  },

  initializeDappKeyPair: async () => {
    let keyPair: nacl.BoxKeyPair;

    try {
      // 尝试从存储加载
      const stored = await storageUtils.getDappKeyPair();
      if (stored) {
        keyPair = {
          publicKey: bs58.decode(stored.publicKey),
          secretKey: bs58.decode(stored.secretKey),
        };
      } else {
        keyPair = nacl.box.keyPair();
      }
    } catch (error) {
      console.error('Failed to load stored key pair:', error);
      keyPair = nacl.box.keyPair();
    }

    // 保存密钥对
    try {
      await storageUtils.setDappKeyPair({
        publicKey: bs58.encode(keyPair.publicKey),
        secretKey: bs58.encode(keyPair.secretKey),
      });
    } catch (error) {
      console.error('Failed to save key pair:', error);
    }

    set({ dappKeyPair: keyPair });
  },

  setBalance: (balance) => set({ balance }),

  setLoadingBalance: (loading) => set({ isLoadingBalance: loading }),

  handleAccountSwitch: async () => {
    const { addLog, clearWalletSession } = get();

    addLog('🔄 检测到账户切换，准备重新连接...');

    // 清除当前状态
    set({
      balance: null,
      isLoadingBalance: false,
      isConnected: false,
    });

    // 清除会话数据
    await clearWalletSession();

    addLog('💡 请点击"连接钱包"按钮重新连接');
  },

  refreshConnection: async () => {
    const { addLog, clearWalletSession } = get();

    addLog('🔄 刷新连接中...');

    // 清除旧的会话
    await clearWalletSession();

    addLog('✅ 连接已重置，请重新连接钱包');
  },

  addLog: (log) => {
    const currentLogs = get().logs;
    // 限制日志数量，避免内存占用过多
    const maxLogs = 100;
    const newLogs = [...currentLogs, `> ${log}`].slice(-maxLogs);
    set({ logs: newLogs });
  },

  clearLogs: () => {
    set({ logs: [] });
  },

  loadStoredLogs: async () => {
    // 日志不持久化，所以不需要加载
    return Promise.resolve();
  },

  setDeepLink: (url) => set({ deepLink: url }),

  setSignatureContext: (message, walletAddress) => set({
    signatureContext: { message, walletAddress }
  }),

  clearSignatureContext: () => set({ signatureContext: null }),

  // 签名响应处理方法
  registerSignatureHandler: (id: string, handler: (response: any) => void) => {
    const { signatureResponseHandlers } = get();
    signatureResponseHandlers.set(id, handler);
    set({ signatureResponseHandlers: new Map(signatureResponseHandlers) });
  },

  unregisterSignatureHandler: (id: string) => {
    const { signatureResponseHandlers } = get();
    signatureResponseHandlers.delete(id);
    set({ signatureResponseHandlers: new Map(signatureResponseHandlers) });
  },

  handleSignatureResponse: (id: string, response: any) => {
    const { signatureResponseHandlers } = get();
    const handler = signatureResponseHandlers.get(id);
    if (handler) {
      handler(response);
      // 处理完成后移除handler
      signatureResponseHandlers.delete(id);
      set({ signatureResponseHandlers: new Map(signatureResponseHandlers) });
    }
  },

  initialize: async () => {
    const { initializeDappKeyPair, loadStoredSession, loadStoredLogs } = get();
    try {
      await Promise.all([
        initializeDappKeyPair(),
        loadStoredSession(),
        loadStoredLogs(),
      ]);
    } catch (error) {
      console.error('Failed to initialize wallet store:', error);
    }
  },
}));
