import { useLogin } from "@/hooks/useLogin"
import { usePathname, useLocalSearchParams } from 'expo-router';
import { usePhantomDeeplinkWalletConnector } from '@privy-io/expo/connectors';
import { usePhantomWallet } from '@/stores/phantomWalletStore';
import { useEffect, useMemo } from 'react';
import { saveToken, useUserStore } from '@/api/request';
import { useTranslation } from 'react-i18next';
import { connectWallet } from '@/api/wallet';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { showToast } from '@/utils/toast';
import { useModal } from '@/hooks/modal.hook';
import { useLoginStore } from '@/stores/login.store';
export const Layout = ({ children }) => {
  useWalletBalance()
  const { t } = useTranslation();
  const { wallet, setWallet } = usePhantomWallet()
  const currentPath = usePathname()
  const searchParams = useLocalSearchParams()
  const token = useUserStore(s => s.token)
  const { close } = useModal()
  const { isLogin } = useLoginStore()

  // 构建完整的重定向URI，包含查询参数
  const redirectUri = useMemo(() => {
    const basePath = currentPath || '/';

    // 如果有查询参数，构建查询字符串
    if (searchParams && Object.keys(searchParams).length > 0) {
      const queryString = new URLSearchParams();
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // 处理数组参数
          if (Array.isArray(value)) {
            value.forEach(v => queryString.append(key, String(v)));
          } else {
            queryString.set(key, String(value));
          }
        }
      });

      const queryStr = queryString.toString();
      return queryStr ? `${basePath}?${queryStr}` : basePath;
    }

    return basePath;
  }, [currentPath, searchParams]);

  const phantom = usePhantomDeeplinkWalletConnector({
    appUrl: 'https://onchain.channel',
    redirectUri: '/back',
  });

  console.log('phantom', phantom)
  console.log('🚀 phantom address', phantom?.address)
  console.log('🚀 phantom isConnected', phantom?.isConnected)

  useEffect(() => {
    if (!wallet && phantom) {
      console.log('🔧 初始化 Phantom 连接器');
      setWallet(phantom);
    }
  }, [phantom, wallet, setWallet]);

  useEffect(() => {
    if (phantom.address && !wallet.address) {
      console.log('🚀 Phantom 钱包已连接，地址:', phantom.address);
      setWallet(phantom)
    }
  }, [phantom.address])
  useEffect(() => {
    if (token && !phantom.address) {
      // phantom.connect()
    }
  }, [phantom.address, token])

  // 安全地获取钱包属性
  const address = wallet?.address
  const isConnected = wallet?.isConnected
  const signMessage = wallet?.signMessage

  console.log('🚀 wallet address', address)
  console.log('🚀 wallet isConnected', isConnected)
  const login = async () => {
    try {
      console.log('当前钱包状态:', {
        address,
        isConnected,
        hasAddress: !!address
      });

      if (!address) {
        console.log('❌ 钱包地址不存在');
        return;
      }

      if (!isConnected) {
        console.log('❌ 钱包未连接');
        return;
      }

      if (!signMessage) {
        console.log('❌ 签名方法不存在');
        return;
      }

      close()
      const message = `Welcome to Onchain! Sign in at ${Date.now()}`;
      console.log('✅ 准备签名 ===================>>>>>>>>>>>', message);

      const signTx = await signMessage(message)
      console.log('✅ 签名成功 ===================>>>>>>>>>>> ', signTx);

      // 处理签名响应
      const signature = typeof signTx === 'string' ? signTx : signTx?.signature || signTx?.toString();
      let signatureBase64: string;

      if (typeof signature === 'string') {
        try {
          const signatureBytes = bs58.decode(signature);
          signatureBase64 = Buffer.from(signatureBytes).toString('base64');
        } catch (error: any) {
          signatureBase64 = signature;
        }
      } else {
        console.log('❌ 签名格式错误');
        return;
      }

      const walletConnectData = {
        signature: signatureBase64,
        walletAddress: new PublicKey(address),
        message: message
      };

      console.log('📤 发送登录请求:', walletConnectData);
      const data = await connectWallet(walletConnectData)
      console.log('✅ 登录响应:', data);

      if (data.code === 200 && data.data.token) {
        showToast.success(t('toast.login_successful'))
        saveToken(data.data.token, address);
      }

    } catch (error) {
      console.error('❌ 登录失败:', error);
      if (error instanceof Error) {
        console.error('错误消息:', error.message);
        console.error('错误堆栈:', error.stack);

        if (error.message.includes('reconnect')) {
          showToast.warning(t('toast.wallet_reconnect_required') || 'Please reconnect your wallet');
        } else {
          showToast.error(t('toast.login_failed') || 'Login failed');
        }
      }
    }
  }

  useEffect(() => {
    console.log('钱包状态:', { address, isConnected, token });

    if (address && isConnected && !token && isLogin) {
      console.log('🚀 开始自动登录，当前地址:', address);
      login();
    } else if (token && address) {
      console.log('✅ 用户已登录，地址:', address, 'token:', token);
    }
  }, [address, isConnected, token]);


  useLogin()
  return children
}
