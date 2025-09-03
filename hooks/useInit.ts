import React, { useEffect, useRef } from "react";
import { loadToken, useUserStore } from '@/api/request';
import { Language } from '@/constants/language';
import i18n from "@/messages/i18n";
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { usePhantomWallet } from '@/stores/phantomWalletStore';
import { usePushNotifications } from '@/hooks/usePushNotifications';
export const useInit = () => {
  const { autoCheckOnLaunch } = useAppUpdate();
  const { wallet, initWallet } = usePhantomWallet();
  const { initializePush } = usePushNotifications();
  const run = useRef(false);

  useEffect(() => {
      // 设置语言
      useUserStore.getState().setLanguage(i18n.language === Language.ZH ? 0 : 1);

      // 自动检查更新
      autoCheckOnLaunch();

      // 初始化推送服务
      initializePush();
  }, [i18n.language, autoCheckOnLaunch, initializePush])

  useEffect(() => {
     const initializeApp = async () => {
      // 加载token和publicKey
      const { token, publicKey } = await loadToken();

      console.log('initializeApp publicKey', publicKey)
      // 如果有保存的publicKey，同步到钱包状态
      if (publicKey && token && !wallet.address) {
        console.log('🔄 同步已保存的钱包地址:', publicKey);
        initWallet(publicKey)
      }

    };

    if(wallet && !run.current) {
      // initializeApp();
      run.current = true
    }
  }, [wallet])
}