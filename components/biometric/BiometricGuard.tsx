import React, { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Box, Text, Button, ButtonText } from '@/components/ui';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useBiometricLogin } from '@/hooks/useBiometricLogin';
import { useBiometricAppLock } from '@/stores/biometricStore';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

interface BiometricGuardProps {
  children: React.ReactNode;
}

type GuardState = 
  | 'checking'      // 检查生物识别状态
  | 'authenticating' // 正在进行生物识别
  | 'authenticated' // 已通过验证
  | 'failed'        // 验证失败
  | 'disabled'      // 生物识别未启用
  | 'unavailable';  // 设备不支持

export const BiometricGuard: React.FC<BiometricGuardProps> = ({ children }) => {
  const { t, ready } = useTranslation();
  const [guardState, setGuardState] = useState<GuardState>('checking');
  const [error, setError] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isAppActive, setIsAppActive] = useState(true);

  const { isSupported, isEnabled, authenticate } = useBiometricAuth();
  const { tryAutoLogin } = useBiometricLogin();
  const { isEnabled: isAppLockEnabled, isAuthRequired, isAuthExpired, updateAuthTime, settings } = useBiometricAppLock();

  // 如果 i18n 还没有准备好，显示加载状态
  if (!ready) {
    return (
      <Box className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </Box>
    );
  }

  // 监听应用状态变化
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && !isAppActive) {
        // 应用从后台回到前台
        setIsAppActive(true);

        // 检查是否需要重新认证
        if (isAppLockEnabled && settings.requireOnBackground &&
            (isAuthExpired || guardState === 'authenticated')) {
          setGuardState('checking');
          performBiometricCheck();
        }
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        setIsAppActive(false);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isAppActive, isAppLockEnabled, settings.requireOnBackground, isAuthExpired, guardState]);

  // 执行生物识别检查
  const performBiometricCheck = useCallback(async () => {
    try {
      setError('');

      // 检查是否启用了应用锁定
      if (!isAppLockEnabled) {
        setGuardState('disabled');
        return;
      }

      // 检查是否需要认证（启动时或后台返回时）
      if (!isAuthRequired) {
        setGuardState('authenticated');
        return;
      }

      // 检查设备是否支持生物识别
      if (!isSupported) {
        setGuardState('unavailable');
        return;
      }

      // 检查是否启用了生物识别
      if (!isEnabled) {
        setGuardState('disabled');
        return;
      }

      setGuardState('authenticating');

      // 尝试自动登录（包含生物识别验证）
      const loginResult = await tryAutoLogin();
      
      if (loginResult.success) {
        setGuardState('authenticated');
        setRetryCount(0);
        // 更新认证时间
        updateAuthTime();
      } else {
        // 如果自动登录失败，进行单纯的生物识别验证
        const authResult = await authenticate(
          t('biometric.guard.prompt', 'Please authenticate to access the app')
        );
        
        if (authResult.success) {
          setGuardState('authenticated');
          setRetryCount(0);
          // 更新认证时间
          updateAuthTime();
        } else {
          setGuardState('failed');
          setError(authResult.error || t('biometric.error.authFailed', 'Authentication failed'));
          setRetryCount(prev => prev + 1);
        }
      }
    } catch (error: any) {
      setGuardState('failed');
      setError(error.message || t('biometric.error.unknown', 'Unknown error occurred'));
      setRetryCount(prev => prev + 1);
    }
  }, [isAppLockEnabled, isSupported, isEnabled, authenticate, tryAutoLogin, updateAuthTime, t]);

  // 初始检查
  useEffect(() => {
    if (guardState === 'checking') {
      performBiometricCheck();
    }
  }, [guardState, performBiometricCheck]);

  // 重试验证
  const handleRetry = useCallback(() => {
    setGuardState('checking');
  }, []);

  // 跳过生物识别（仅在多次失败后显示）
  const handleSkip = useCallback(() => {
    setGuardState('authenticated');
  }, []);

  // 如果应用锁定未启用、生物识别不可用或未启用，直接显示应用内容
  if (!isAppLockEnabled || guardState === 'unavailable' || guardState === 'disabled') {
    return <>{children}</>;
  }

  // 如果已通过验证，显示应用内容
  if (guardState === 'authenticated') {
    return <>{children}</>;
  }

  // 显示生物识别验证界面
  return (
    <BiometricGuardScreen
      state={guardState}
      error={error}
      retryCount={retryCount}
      onRetry={handleRetry}
      onSkip={handleSkip}
    />
  );
};

interface BiometricGuardScreenProps {
  state: GuardState;
  error: string;
  retryCount: number;
  onRetry: () => void;
  onSkip: () => void;
}

const BiometricGuardScreen: React.FC<BiometricGuardScreenProps> = ({
  state,
  error,
  retryCount,
  onRetry,
  onSkip,
}) => {
  const { t } = useTranslation();

  const getStateContent = () => {
    switch (state) {
      case 'checking':
        return {
          title: t('biometric.guard.checking', 'Checking biometric settings...'),
          subtitle: t('biometric.guard.checkingSubtitle', 'Please wait'),
          showSpinner: true,
        };
      case 'authenticating':
        return {
          title: t('biometric.guard.authenticating', 'Authenticating...'),
          subtitle: t('biometric.guard.authenticatingSubtitle', 'Please use your biometric authentication'),
          showSpinner: true,
        };
      case 'failed':
        return {
          title: t('biometric.guard.failed', 'Authentication Failed'),
          subtitle: error || t('biometric.guard.failedSubtitle', 'Please try again'),
          showSpinner: false,
        };
      default:
        return {
          title: t('biometric.guard.default', 'Biometric Authentication'),
          subtitle: t('biometric.guard.defaultSubtitle', 'Please authenticate to continue'),
          showSpinner: false,
        };
    }
  };

  const content = getStateContent();

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={{ flex: 1 }}
    >
      <Box className="flex-1 justify-center items-center px-8">
        {/* 生物识别图标 */}
        <Box className="mb-8">
          <Box className="w-24 h-24 bg-blue-100 rounded-full justify-center items-center">
            <Text className="text-4xl">🔐</Text>
          </Box>
        </Box>

        {/* 标题和副标题 */}
        <Box className="mb-8 items-center">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            {content.title}
          </Text>
          <Text className="text-base text-gray-600 text-center">
            {content.subtitle}
          </Text>
        </Box>

        {/* 操作按钮 */}
        {state === 'failed' && (
          <Box className="w-full max-w-xs gap-4">
            <Button
              onPress={onRetry}
              className="bg-blue-600 rounded-xl h-12"
            >
              <ButtonText className="text-white font-medium">
                {t('biometric.guard.retry', 'Try Again')}
              </ButtonText>
            </Button>

            {/* 多次失败后显示跳过选项 */}
            {retryCount >= 3 && (
              <Button
                onPress={onSkip}
                variant="outline"
                className="border-gray-300 rounded-xl h-12"
              >
                <ButtonText className="text-gray-700 font-medium">
                  {t('biometric.guard.skip', 'Skip for now')}
                </ButtonText>
              </Button>
            )}
          </Box>
        )}

        {/* 提示信息 */}
        <Box className="mt-8 px-4">
          <Text className="text-sm text-gray-500 text-center">
            {t('biometric.guard.hint', 'This helps keep your account secure')}
          </Text>
        </Box>
      </Box>
    </LinearGradient>
  );
};
