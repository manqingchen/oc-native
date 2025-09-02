import { useEffect } from 'react';
import { useWalletState, useWalletActions } from "./useWallet";
import { saveToken, useUserStore } from '@/api/request';
import { connectWallet } from '@/api/wallet';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import Toast from 'react-native-root-toast';
import { useTranslation } from 'react-i18next';
import { getFofFundClientByEnv } from '@/fof_fund_sdk/src'
import { useFofStore } from '@/stores/fof.store';
import { CURRENT_ENV } from '@/lib/config';
import { usePhantomWallet } from '@/stores/phantomWalletStore';

export const useLogin = () => {
  // const { address, isConnected, status } = useWalletState();
  // const { signMessage } = useWalletActions()
  // const { wallet } = usePhantomWallet()
  
  // const { address, isConnected, signMessage } = wallet || {}
  // const address = wallet.address
  // const isConnected = wallet.isConnected  
  // const signMessage = wallet.signMessage
  const token = useUserStore(s => s.token)
  const { t } = useTranslation();
  const { fof, setFoF } = useFofStore()
  const currentNet = CURRENT_ENV

  // const login = async () => {
  //   try {
  //     // 添加详细的状态检查和日志
  //     console.log('当前钱包状态:', {
  //       address,
  //       isConnected,
  //       hasAddress: !!address
  //     });

  //     if (!address) {
  //       console.log('❌ 钱包地址不存在');
  //       return;
  //     }

  //     if (!isConnected) {
  //       console.log('❌ 钱包未连接');
  //       return;
  //     }

  //     const message = `Welcome to Onchain! Sign in at ${Date.now()}`;
  //     console.log('✅ 准备签名 ===================>>>>>>>>>>>', message);

  //     const signTx = await signMessage(message)
  //     console.log('✅ 签名成功 ===================>>>>>>>>>>> ', signTx);

  //     // 处理签名响应，确保是字符串格式
  //     const signature = typeof signTx === 'string' ? signTx : signTx.signature || signTx.toString();
  //     let signatureBase64: string;
  //     if (typeof signature === 'string') {
  //       // 如果签名已经是字符串，尝试解码后再编码为base64
  //       try {
  //         const signatureBytes = bs58.decode(signature);
  //         signatureBase64 = Buffer.from(signatureBytes).toString('base64');
  //       } catch (error: any) {
  //         // 如果不是base58格式，直接使用
  //         signatureBase64 = signature;
  //       }
  //     }
  //     // 使用存储的消息和钱包地址，按照要求的格式
  //     const walletConnectData = {
  //       signature: signatureBase64,
  //       walletAddress: new PublicKey(address),
  //       message: message
  //     };

  //     console.log('📤 发送登录请求:', walletConnectData);
  //     const data = await connectWallet(walletConnectData)
  //     console.log('✅ 登录响应:', data);

  //     if (data.code === 200 && data.data.token) {
  //       // 登录成功，保存token和publicKey
  //       Toast.show(t('toast.login_successful'))
  //       saveToken(data.data.token, address);
  //     }

  //   } catch (error) {
  //     console.error('❌ 登录失败:', error);
  //     // 打印更详细的错误信息
  //     if (error instanceof Error) {
  //       console.error('错误消息:', error.message);
  //       console.error('错误堆栈:', error.stack);

  //       // 如果是需要重新连接的错误，显示特殊提示
  //       if (error.message.includes('reconnect')) {
  //         Toast.show(t('toast.wallet_reconnect_required') || 'Please reconnect your wallet');
  //       } else {
  //         Toast.show(t('toast.login_failed') || 'Login failed');
  //       }
  //     }
  //   }
  // }

  // useEffect(() => {
  //   console.log('钱包状态:', { address, isConnected, token });

  //   // 只有在钱包完全连接且没有token时才尝试登录
  //   // 如果已经有token，说明用户已经登录过了，不需要重复登录
  //   if (address && isConnected && !token) {
  //     console.log('🚀 开始自动登录，当前地址:', address);
  //     login();
  //   } else if (token && address) {
  //     console.log('✅ 用户已登录，地址:', address, 'token:', token);
  //   }
  // }, [address, isConnected, token]);

  useEffect(() => {
    if (!fof) {
      const fofSdk = getFofFundClientByEnv(currentNet)
      setFoF(fofSdk as any)
    } else {
    }
  }, [fof])
  return {
    // login
  }
};
