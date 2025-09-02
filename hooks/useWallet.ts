import { useEffect } from 'react';
import { usePathname } from 'expo-router';
import { usePhantomDeeplinkWalletConnector } from '@privy-io/expo/connectors';
import { useWalletStore } from '@/stores/walletStore';

/**
 * 全局钱包 Hook
 * 
 * 使用 Zustand 管理全局钱包状态，避免多个实例问题
 * 默认重定向回当前页面，也可以自定义重定向路径
 */
export function useWallet(customRedirectUri?: string) {
  const currentPath = usePathname()
  
  // 从 Zustand store 获取状态和方法
  const {
    address,
    publicKey,
    status,
    isConnected,
    error,
    connection,
    isInitialized,
    
    // 操作方法
    connect,
    disconnect,
    signMessage,
    signTransaction,
    signAndSendTransaction,
    signAllTransactions,
    
    // 内部方法
    setWalletInfo,
    setStatus,
    setError,
    _setPhantomConnector,
    _phantomConnector,
  } = useWalletStore();
  
  // 确定重定向路径：自定义 > 当前路径 > 默认首页
  const redirectUri = customRedirectUri || currentPath || '/';
  
  // 初始化 Phantom 连接器
  const phantom = usePhantomDeeplinkWalletConnector({
    appUrl: 'https://yourdapp.com', // 替换为你的实际应用URL
    redirectUri: redirectUri,
  });
  
  console.log('phantom', phantom)
  // 初始化钱包连接器
  useEffect(() => {
    if (!_phantomConnector && phantom) {
      console.log('🔧 初始化 Phantom 连接器');
      _setPhantomConnector(phantom);
    }
  }, [phantom, _phantomConnector, _setPhantomConnector]);

  // 监听 Phantom 连接器状态变化
  useEffect(() => {
    if (!phantom) {
      console.log('⚠️ Phantom 连接器不存在');
      return;
    }

    // 只有当 Phantom 实际连接时才同步状态
    // 如果 Phantom 未连接但我们有保存的地址，保持当前状态不变
    if (phantom.isConnected && phantom.address) {
      console.log('✅ Phantom 实际连接，同步状态:', {
        phantomAddress: phantom.address,
        phantomConnected: phantom.isConnected
      });

      // 更新钱包信息
      setWalletInfo({
        address: phantom.address,
        isConnected: phantom.isConnected,
      });

      // 更新状态
      setStatus('connected');
    } else if (!phantom.isConnected && !address) {
      // 只有在没有保存地址的情况下才设置为断开连接
      console.log('❌ Phantom 未连接且无保存地址，设置为断开连接');
      setWalletInfo({
        address: null,
        isConnected: false,
      });
      setStatus('disconnected');
    } else {
      console.log('🔄 保持当前状态，Phantom 未连接但有保存的地址');
    }

  }, [phantom.address, phantom.isConnected, address, setWalletInfo, setStatus]);
  
  // 包装 signMessage 方法，直接使用 phantom 连接器
  const handleSignMessage = async (message: string) => {
    console.log('🔍 useWallet signMessage 开始');

    if (!phantom) {
      throw new Error('Phantom connector not available');
    }

    if (!phantom.isConnected) {
      // 如果有保存的地址但 Phantom 未连接，提示用户需要重新连接
      if (address) {
        throw new Error('Please reconnect your Phantom wallet to sign messages');
      } else {
        throw new Error('Phantom wallet not connected');
      }
    }

    try {
      console.log('✅ 调用 phantom.signMessage 直接');
      const result = await phantom.signMessage(message);
      console.log('✅ phantom.signMessage 成功:', result);
      return result;
    } catch (error) {
      console.error('❌ phantom.signMessage 失败:', error);
      throw error;
    }
  };

  // 返回钱包状态和操作方法
  return {
    // 钱包信息
    address,
    publicKey,
    status,
    isConnected,
    error,
    connection,

    // 钱包操作 - 使用直接的 phantom 方法而不是 store 方法
    connect,
    disconnect,
    signMessage: handleSignMessage, // 使用我们包装的方法
    signTransaction,
    signAndSendTransaction,
    signAllTransactions,

    // 额外信息
    redirectUri,
  };
}

/**
 * 只读钱包状态 Hook
 * 
 * 用于只需要读取钱包状态而不需要初始化连接器的组件
 * 避免不必要的 Phantom 连接器创建
 */
export function useWalletState() {
  const {
    address,
    publicKey,
    status,
    isConnected,
    error,
    connection,
  } = useWalletStore();
  
  return {
    address,
    publicKey,
    status,
    isConnected,
    error,
    connection,
  };
}

/**
 * 钱包操作 Hook
 *
 * 用于只需要钱包操作方法的组件
 * 注意：这个 hook 会创建 phantom 连接器实例，如果只需要状态请使用 useWalletState
 */
export function useWalletActions() {
  // 使用完整的 useWallet 来获取正确的方法
  const wallet = useWallet();

  return {
    connect: wallet.connect,
    disconnect: wallet.disconnect,
    signMessage: wallet.signMessage,
    signTransaction: wallet.signTransaction,
    signAndSendTransaction: wallet.signAndSendTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };
}
