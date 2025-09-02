import React, { createContext, useContext, ReactNode } from 'react';
import { useSolanaWallet, UseWalletReturn } from '@/hooks/useSolanaWallet';

// 创建 Context
const WalletContext = createContext<UseWalletReturn | null>(null);

// Provider 组件
export function WalletProvider({ children }: { children: ReactNode }) {
  // 只在这里创建一次钱包实例
  const wallet = useSolanaWallet();

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

// Hook 用于获取钱包实例
export function useWallet(): UseWalletReturn {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
