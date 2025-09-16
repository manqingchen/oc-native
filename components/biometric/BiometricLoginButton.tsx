import React from 'react';
import { Alert } from 'react-native';
import { Button, ButtonText, ButtonIcon, Box, Text } from '@/components/ui';
import { useBiometricLogin } from '@/hooks/useBiometricLogin';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

interface BiometricLoginButtonProps {
  onLoginSuccess?: (credentials: any) => void;
  onLoginError?: (error: string) => void;
  onRequiresManualLogin?: () => void;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showStatusText?: boolean;
}

export const BiometricLoginButton: React.FC<BiometricLoginButtonProps> = ({
  onLoginSuccess,
  onLoginError,
  onRequiresManualLogin,
  variant = 'outline',
  size = 'md',
  disabled = false,
  showStatusText = true,
}) => {
  const { t } = useTranslation();
  const {
    loginState,
    isProcessing,
    performBiometricLogin,
    getBiometricStatusDescription,
  } = useBiometricLogin();

  // 处理生物识别登录
  const handleBiometricLogin = async () => {
    try {
      const result = await performBiometricLogin();
      
      if (result.success) {
        onLoginSuccess?.(result.credentials);
      } else {
        onLoginError?.(result.error || 'Authentication failed');
        
        if (result.requiresManualLogin) {
          onRequiresManualLogin?.();
        }
      }
    } catch (error: any) {
      const errorMsg = error.message || t('biometric.error.unknown', 'Unknown error occurred');
      onLoginError?.(errorMsg);
      
      Alert.alert(
        t('biometric.error.title', 'Authentication Error'),
        errorMsg
      );
    }
  };

  // 检查是否可用
  const isAvailable = loginState.canAutoLogin;
  const isDisabled = disabled || isProcessing || !isAvailable;

  if (!loginState.isAvailable) {
    return null; // 不显示按钮如果设备不支持
  }

  return (
    <Box className="w-full">
      <Button
        variant={variant}
        size={size}
        disabled={isDisabled}
        onPress={handleBiometricLogin}
        className={`w-full flex-row items-center justify-center ${isDisabled ? 'opacity-50' : ''}`}
      >
        <ButtonIcon 
          as={Ionicons} 
          name="finger-print"
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
          className="mr-2"
        />
        <ButtonText>
          {isProcessing 
            ? t('biometric.authenticating', 'Authenticating...') 
            : t('biometric.loginWithBiometric', 'Login with Biometric')
          }
        </ButtonText>
      </Button>
      
      {showStatusText && (
        <Text className="text-xs text-gray-500 text-center mt-2">
          {getBiometricStatusDescription()}
        </Text>
      )}
    </Box>
  );
};

// 快速生物识别登录组件（用于应用启动时的自动登录）
export const QuickBiometricLogin: React.FC<{
  onAutoLoginResult?: (success: boolean, credentials?: any) => void;
}> = ({ onAutoLoginResult }) => {
  const { tryAutoLogin } = useBiometricLogin();
  const { t } = useTranslation();

  React.useEffect(() => {
    const attemptAutoLogin = async () => {
      try {
        const result = await tryAutoLogin();
        onAutoLoginResult?.(result.success, result.credentials);
      } catch (error) {
        onAutoLoginResult?.(false);
      }
    };

    attemptAutoLogin();
  }, [tryAutoLogin, onAutoLoginResult]);

  return (
    <Box className="flex-1 items-center justify-center p-6">
      <Ionicons name="finger-print" size={48} color="#3b82f6" />
      <Text className="text-lg font-medium text-gray-900 mt-4 text-center">
        {t('biometric.checking', 'Checking biometric authentication...')}
      </Text>
    </Box>
  );
};
