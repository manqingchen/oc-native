import React from 'react';
import { Alert } from 'react-native';
import { Button, ButtonText, ButtonIcon, Box, Text } from '@/components/ui';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

interface BiometricAuthButtonProps {
  onSuccess?: (credentials: any) => void;
  onError?: (error: string) => void;
  variant?: 'solid' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  showText?: boolean;
}

export const BiometricAuthButton: React.FC<BiometricAuthButtonProps> = ({
  onSuccess,
  onError,
  variant = 'solid',
  size = 'md',
  disabled = false,
  showText = true,
}) => {
  const { t } = useTranslation();
  const {
    isSupported,
    isEnrolled,
    isEnabled,
    supportedTypes,
    isLoading,
    authenticate,
    getStoredCredentials,
    getAuthTypeDescription,
  } = useBiometricAuth();

  // 获取图标
  const getIcon = () => {
    if (supportedTypes.includes(1)) { // FINGERPRINT
      return 'finger-print';
    }
    if (supportedTypes.includes(2)) { // FACIAL_RECOGNITION
      return 'scan';
    }
    return 'shield-checkmark';
  };

  // 处理认证
  const handleAuthenticate = async () => {
    try {
      if (!isSupported) {
        Alert.alert(
          t('biometric.error.title', 'Biometric Error'),
          t('biometric.error.noHardware', 'Device does not support biometric authentication')
        );
        return;
      }

      if (!isEnrolled) {
        Alert.alert(
          t('biometric.error.title', 'Biometric Error'),
          t('biometric.error.notEnrolled', 'No biometric data enrolled on this device'),
          [
            {
              text: t('common.cancel', 'Cancel'),
              style: 'cancel',
            },
            {
              text: t('biometric.goToSettings', 'Go to Settings'),
              onPress: () => {
                // 这里可以添加跳转到设置的逻辑
                console.log('Navigate to device settings');
              },
            },
          ]
        );
        return;
      }

      if (!isEnabled) {
        Alert.alert(
          t('biometric.error.title', 'Biometric Error'),
          t('biometric.error.notEnabled', 'Biometric authentication is not enabled for this app')
        );
        return;
      }

      // 执行认证并获取凭证
      const credentials = await getStoredCredentials();
      
      if (credentials) {
        onSuccess?.(credentials);
      } else {
        const errorMsg = t('biometric.error.noCredentials', 'No stored credentials found');
        onError?.(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.message || t('biometric.error.unknown', 'Unknown error occurred');
      onError?.(errorMsg);
      
      Alert.alert(
        t('biometric.error.title', 'Authentication Error'),
        errorMsg
      );
    }
  };

  // 检查是否可用
  const isAvailable = isSupported && isEnrolled && isEnabled;
  const isDisabled = disabled || isLoading || !isAvailable;

  return (
    <Button
      variant={variant}
      size={size}
      disabled={isDisabled}
      onPress={handleAuthenticate}
      className={`flex-row items-center justify-center ${isDisabled ? 'opacity-50' : ''}`}
    >
      <ButtonIcon
        as={Ionicons}
        name={getIcon() as any}
        className="mr-2"
      />
      {showText && (
        <ButtonText>
          {isLoading 
            ? t('biometric.authenticating', 'Authenticating...') 
            : getAuthTypeDescription(supportedTypes)
          }
        </ButtonText>
      )}
    </Button>
  );
};

// 生物识别状态指示器
export const BiometricStatusIndicator: React.FC = () => {
  const { t } = useTranslation();
  const {
    isSupported,
    isEnrolled,
    isEnabled,
    supportedTypes,
    getAuthTypeDescription,
  } = useBiometricAuth();

  const getStatusColor = () => {
    if (isSupported && isEnrolled && isEnabled) return 'text-green-600';
    if (isSupported && isEnrolled) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    if (!isSupported) {
      return t('biometric.status.notSupported', 'Not Supported');
    }
    if (!isEnrolled) {
      return t('biometric.status.notEnrolled', 'Not Enrolled');
    }
    if (!isEnabled) {
      return t('biometric.status.notEnabled', 'Not Enabled');
    }
    return t('biometric.status.enabled', 'Enabled');
  };

  return (
    <Box className="flex-row items-center">
      <Ionicons 
        name={isSupported && isEnrolled && isEnabled ? 'checkmark-circle' : 'alert-circle'}
        size={16}
        color={isSupported && isEnrolled && isEnabled ? '#16a34a' : '#dc2626'}
        style={{ marginRight: 8 }}
      />
      <Text className={`text-sm ${getStatusColor()}`}>
        {getAuthTypeDescription(supportedTypes)}: {getStatusText()}
      </Text>
    </Box>
  );
};
