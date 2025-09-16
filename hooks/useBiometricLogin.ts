import { useCallback, useEffect, useState } from 'react';
import { useBiometricAuth, type StoredCredentials } from './useBiometricAuth';
import { usePhantomWallet } from '@/stores/phantomWalletStore';
import { useUserStore } from '@/api/request';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

// 生物识别登录状态
export interface BiometricLoginState {
  isAvailable: boolean;
  isEnabled: boolean;
  canAutoLogin: boolean;
  lastLoginTime?: number;
}

// 生物识别登录结果
export interface BiometricLoginResult {
  success: boolean;
  credentials?: StoredCredentials;
  error?: string;
  requiresManualLogin?: boolean;
}

export const useBiometricLogin = () => {
  const { t } = useTranslation();
  const { wallet } = usePhantomWallet();
  const userStore = useUserStore();
  
  const {
    isSupported,
    isEnrolled,
    isEnabled,
    authenticate,
    enableBiometric,
    disableBiometric,
    getStoredCredentials,
    checkBiometricEnabled,
  } = useBiometricAuth();

  const [loginState, setLoginState] = useState<BiometricLoginState>({
    isAvailable: false,
    isEnabled: false,
    canAutoLogin: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // 更新登录状态
  const updateLoginState = useCallback(async () => {
    const isAvailable = isSupported && isEnrolled;
    const enabled = await checkBiometricEnabled();
    
    setLoginState({
      isAvailable,
      isEnabled: enabled,
      canAutoLogin: isAvailable && enabled,
    });
  }, [isSupported, isEnrolled, checkBiometricEnabled]);

  // 初始化时更新状态
  useEffect(() => {
    updateLoginState();
  }, [updateLoginState]);

  // 设置生物识别登录
  const setupBiometricLogin = useCallback(async (): Promise<boolean> => {
    if (!loginState.isAvailable) {
      Alert.alert(
        t('biometric.error.title', 'Error'),
        t('biometric.error.notAvailable', 'Biometric authentication is not available on this device')
      );
      return false;
    }

    if (!wallet?.address || !userStore.token) {
      Alert.alert(
        t('biometric.error.title', 'Error'),
        t('biometric.error.noSession', 'Please login first to enable biometric authentication')
      );
      return false;
    }

    setIsProcessing(true);

    try {
      // 准备要存储的凭证
      const credentials: StoredCredentials = {
        username: userStore.user?.username || 'user',
        token: userStore.token,
        walletAddress: wallet.address,
        timestamp: Date.now(),
      };

      // 启用生物识别认证
      const success = await enableBiometric(credentials);
      
      if (success) {
        await updateLoginState();
        Alert.alert(
          t('biometric.success.title', 'Success'),
          t('biometric.success.setupComplete', 'Biometric login has been set up successfully!')
        );
        return true;
      } else {
        Alert.alert(
          t('biometric.error.title', 'Error'),
          t('biometric.error.setupFailed', 'Failed to set up biometric login')
        );
        return false;
      }
    } catch (error: any) {
      Alert.alert(
        t('biometric.error.title', 'Error'),
        error.message || t('biometric.error.unknown', 'Unknown error occurred')
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [loginState.isAvailable, wallet?.address, userStore.token, userStore.user?.username, enableBiometric, updateLoginState, t]);

  // 禁用生物识别登录
  const disableBiometricLogin = useCallback(async (): Promise<boolean> => {
    setIsProcessing(true);

    try {
      const success = await disableBiometric();
      
      if (success) {
        await updateLoginState();
        Alert.alert(
          t('biometric.success.title', 'Success'),
          t('biometric.success.disabled', 'Biometric login has been disabled')
        );
        return true;
      } else {
        Alert.alert(
          t('biometric.error.title', 'Error'),
          t('biometric.error.disableFailed', 'Failed to disable biometric login')
        );
        return false;
      }
    } catch (error: any) {
      Alert.alert(
        t('biometric.error.title', 'Error'),
        error.message || t('biometric.error.unknown', 'Unknown error occurred')
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [disableBiometric, updateLoginState, t]);

  // 执行生物识别登录
  const performBiometricLogin = useCallback(async (): Promise<BiometricLoginResult> => {
    if (!loginState.canAutoLogin) {
      return {
        success: false,
        error: t('biometric.error.notAvailable', 'Biometric login is not available'),
        requiresManualLogin: true,
      };
    }

    setIsProcessing(true);

    try {
      // 获取存储的凭证
      const credentials = await getStoredCredentials();
      
      if (!credentials) {
        return {
          success: false,
          error: t('biometric.error.noCredentials', 'No stored credentials found'),
          requiresManualLogin: true,
        };
      }

      // 检查凭证是否过期（可选，比如30天）
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const isExpired = Date.now() - credentials.timestamp > thirtyDaysInMs;
      
      if (isExpired) {
        return {
          success: false,
          error: t('biometric.error.credentialsExpired', 'Stored credentials have expired'),
          requiresManualLogin: true,
        };
      }

      return {
        success: true,
        credentials,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || t('biometric.error.authFailed', 'Authentication failed'),
        requiresManualLogin: true,
      };
    } finally {
      setIsProcessing(false);
    }
  }, [loginState.canAutoLogin, getStoredCredentials, t]);

  // 尝试自动登录（应用启动时调用）
  const tryAutoLogin = useCallback(async (): Promise<BiometricLoginResult> => {
    // 检查是否已经登录
    if (userStore.token && wallet?.isConnected) {
      return {
        success: true,
        credentials: undefined, // 已经登录，不需要凭证
      };
    }

    // 检查是否可以进行生物识别登录
    if (!loginState.canAutoLogin) {
      return {
        success: false,
        requiresManualLogin: true,
      };
    }

    // 执行生物识别登录
    return await performBiometricLogin();
  }, [userStore.token, wallet?.isConnected, loginState.canAutoLogin, performBiometricLogin]);

  // 提示用户设置生物识别登录
  const promptSetupBiometricLogin = useCallback(() => {
    if (!loginState.isAvailable) {
      return;
    }

    if (loginState.isEnabled) {
      return;
    }

    // 检查是否已经登录且有钱包连接
    if (userStore.token && wallet?.address) {
      Alert.alert(
        t('biometric.prompt.title', 'Enable Biometric Login'),
        t('biometric.prompt.message', 'Would you like to enable biometric login for faster access?'),
        [
          {
            text: t('common.notNow', 'Not Now'),
            style: 'cancel',
          },
          {
            text: t('common.enable', 'Enable'),
            onPress: setupBiometricLogin,
          },
        ]
      );
    }
  }, [loginState.isAvailable, loginState.isEnabled, userStore.token, wallet?.address, setupBiometricLogin, t]);

  // 检查是否应该显示生物识别选项
  const shouldShowBiometricOption = useCallback((): boolean => {
    return loginState.isAvailable;
  }, [loginState.isAvailable]);

  // 获取生物识别状态描述
  const getBiometricStatusDescription = useCallback((): string => {
    if (!isSupported) {
      return t('biometric.status.notSupported', 'Not supported on this device');
    }
    if (!isEnrolled) {
      return t('biometric.status.notEnrolled', 'No biometric data enrolled');
    }
    if (!loginState.isEnabled) {
      return t('biometric.status.notEnabled', 'Not enabled for this app');
    }
    return t('biometric.status.ready', 'Ready for use');
  }, [isSupported, isEnrolled, loginState.isEnabled, t]);

  return {
    // 状态
    loginState,
    isProcessing,
    
    // 方法
    setupBiometricLogin,
    disableBiometricLogin,
    performBiometricLogin,
    tryAutoLogin,
    promptSetupBiometricLogin,
    shouldShowBiometricOption,
    getBiometricStatusDescription,
    updateLoginState,
  };
};
