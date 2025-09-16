import React, { useState } from 'react';
import { Alert, Switch } from 'react-native';
import { 
  Box, 
  Text, 
  Heading, 
  Button, 
  ButtonText, 
  Pressable 
} from '@/components/ui';
import { useBiometricAuth, type StoredCredentials } from '@/hooks/useBiometricAuth';
import { useTranslation } from 'react-i18next';
import { BiometricStatusIndicator } from './BiometricAuthButton';
import { Ionicons } from '@expo/vector-icons';

interface BiometricSettingsProps {
  userCredentials?: StoredCredentials;
  onSettingsChange?: (enabled: boolean) => void;
}

export const BiometricSettings: React.FC<BiometricSettingsProps> = ({
  userCredentials,
  onSettingsChange,
}) => {
  const { t } = useTranslation();
  const {
    isSupported,
    isEnrolled,
    isEnabled,
    supportedTypes,
    securityLevel,
    isLoading,
    enableBiometric,
    disableBiometric,
    getAuthTypeDescription,
  } = useBiometricAuth();

  const [isToggling, setIsToggling] = useState(false);

  // 处理生物识别开关
  const handleToggleBiometric = async (value: boolean) => {
    if (isToggling) return;
    
    setIsToggling(true);
    
    try {
      if (value) {
        // 启用生物识别
        if (!userCredentials) {
          Alert.alert(
            t('biometric.error.title', 'Error'),
            t('biometric.error.noUserCredentials', 'No user credentials available to store')
          );
          return;
        }

        const success = await enableBiometric(userCredentials);
        if (success) {
          Alert.alert(
            t('biometric.success.title', 'Success'),
            t('biometric.success.enabled', 'Biometric authentication has been enabled')
          );
          onSettingsChange?.(true);
        } else {
          Alert.alert(
            t('biometric.error.title', 'Error'),
            t('biometric.error.enableFailed', 'Failed to enable biometric authentication')
          );
        }
      } else {
        // 禁用生物识别
        Alert.alert(
          t('biometric.confirm.title', 'Confirm'),
          t('biometric.confirm.disable', 'Are you sure you want to disable biometric authentication?'),
          [
            {
              text: t('common.cancel', 'Cancel'),
              style: 'cancel',
            },
            {
              text: t('common.confirm', 'Confirm'),
              style: 'destructive',
              onPress: async () => {
                const success = await disableBiometric();
                if (success) {
                  Alert.alert(
                    t('biometric.success.title', 'Success'),
                    t('biometric.success.disabled', 'Biometric authentication has been disabled')
                  );
                  onSettingsChange?.(false);
                } else {
                  Alert.alert(
                    t('biometric.error.title', 'Error'),
                    t('biometric.error.disableFailed', 'Failed to disable biometric authentication')
                  );
                }
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        t('biometric.error.title', 'Error'),
        error.message || t('biometric.error.unknown', 'Unknown error occurred')
      );
    } finally {
      setIsToggling(false);
    }
  };

  // 获取安全等级描述
  const getSecurityLevelDescription = () => {
    switch (securityLevel) {
      case 0: // NONE
        return t('biometric.security.none', 'None');
      case 1: // SECRET
        return t('biometric.security.secret', 'PIN/Pattern');
      case 2: // BIOMETRIC_WEAK
        return t('biometric.security.weak', 'Weak Biometric');
      case 3: // BIOMETRIC_STRONG
        return t('biometric.security.strong', 'Strong Biometric');
      default:
        return t('biometric.security.unknown', 'Unknown');
    }
  };

  // 获取支持的认证类型列表
  const getSupportedTypesList = () => {
    const types = [];
    if (supportedTypes.includes(1)) { // FINGERPRINT
      types.push(t('biometric.type.fingerprint', 'Fingerprint'));
    }
    if (supportedTypes.includes(2)) { // FACIAL_RECOGNITION
      types.push(t('biometric.type.face', 'Face Recognition'));
    }
    if (supportedTypes.includes(3)) { // IRIS
      types.push(t('biometric.type.iris', 'Iris'));
    }
    return types.join(', ') || t('biometric.type.none', 'None');
  };

  const canEnable = isSupported && isEnrolled && !isEnabled;
  const canDisable = isSupported && isEnrolled && isEnabled;

  return (
    <Box className="p-4 bg-white rounded-lg shadow-sm">
      {/* 标题 */}
      <Box className="flex-row items-center mb-4">
        <Ionicons 
          name="shield-checkmark" 
          size={24} 
          color="#3b82f6" 
          style={{ marginRight: 12 }}
        />
        <Heading size="lg" className="text-gray-900">
          {t('biometric.settings.title', 'Biometric Authentication')}
        </Heading>
      </Box>

      {/* 状态指示器 */}
      <Box className="mb-6">
        <BiometricStatusIndicator />
      </Box>

      {/* 主开关 */}
      {(canEnable || canDisable) && (
        <Box className="flex-row items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
          <Box className="flex-1">
            <Text className="text-base font-medium text-gray-900 mb-1">
              {t('biometric.settings.enable', 'Enable Biometric Login')}
            </Text>
            <Text className="text-sm text-gray-600">
              {t('biometric.settings.enableDescription', 'Use your biometric data to quickly sign in')}
            </Text>
          </Box>
          <Switch
            value={isEnabled}
            onValueChange={handleToggleBiometric}
            disabled={isToggling || isLoading}
            trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
            thumbColor={isEnabled ? '#ffffff' : '#f3f4f6'}
          />
        </Box>
      )}

      {/* 详细信息 */}
      <Box className="space-y-4">
        {/* 支持的认证类型 */}
        <Box className="flex-row justify-between items-center py-3 border-b border-gray-100">
          <Text className="text-sm font-medium text-gray-700">
            {t('biometric.settings.supportedTypes', 'Supported Types')}
          </Text>
          <Text className="text-sm text-gray-600">
            {getSupportedTypesList()}
          </Text>
        </Box>

        {/* 安全等级 */}
        <Box className="flex-row justify-between items-center py-3 border-b border-gray-100">
          <Text className="text-sm font-medium text-gray-700">
            {t('biometric.settings.securityLevel', 'Security Level')}
          </Text>
          <Text className="text-sm text-gray-600">
            {getSecurityLevelDescription()}
          </Text>
        </Box>

        {/* 硬件支持 */}
        <Box className="flex-row justify-between items-center py-3 border-b border-gray-100">
          <Text className="text-sm font-medium text-gray-700">
            {t('biometric.settings.hardwareSupport', 'Hardware Support')}
          </Text>
          <Box className="flex-row items-center">
            <Ionicons 
              name={isSupported ? 'checkmark-circle' : 'close-circle'} 
              size={16} 
              color={isSupported ? '#16a34a' : '#dc2626'} 
              style={{ marginRight: 4 }}
            />
            <Text className={`text-sm ${isSupported ? 'text-green-600' : 'text-red-600'}`}>
              {isSupported ? t('common.yes', 'Yes') : t('common.no', 'No')}
            </Text>
          </Box>
        </Box>

        {/* 已注册 */}
        <Box className="flex-row justify-between items-center py-3">
          <Text className="text-sm font-medium text-gray-700">
            {t('biometric.settings.enrolled', 'Biometric Data Enrolled')}
          </Text>
          <Box className="flex-row items-center">
            <Ionicons 
              name={isEnrolled ? 'checkmark-circle' : 'close-circle'} 
              size={16} 
              color={isEnrolled ? '#16a34a' : '#dc2626'} 
              style={{ marginRight: 4 }}
            />
            <Text className={`text-sm ${isEnrolled ? 'text-green-600' : 'text-red-600'}`}>
              {isEnrolled ? t('common.yes', 'Yes') : t('common.no', 'No')}
            </Text>
          </Box>
        </Box>
      </Box>

      {/* 帮助信息 */}
      {!isSupported && (
        <Box className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <Text className="text-sm text-red-700">
            {t('biometric.help.notSupported', 'Your device does not support biometric authentication.')}
          </Text>
        </Box>
      )}

      {isSupported && !isEnrolled && (
        <Box className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <Text className="text-sm text-yellow-700 mb-2">
            {t('biometric.help.notEnrolled', 'No biometric data is enrolled on your device.')}
          </Text>
          <Button
            variant="outline"
            size="sm"
            onPress={() => {
              Alert.alert(
                t('biometric.help.title', 'Setup Required'),
                t('biometric.help.enrollMessage', 'Please go to your device settings to set up biometric authentication.'),
                [
                  { text: t('common.ok', 'OK'), style: 'default' }
                ]
              );
            }}
          >
            <ButtonText className="text-yellow-700">
              {t('biometric.help.setupInstructions', 'Setup Instructions')}
            </ButtonText>
          </Button>
        </Box>
      )}
    </Box>
  );
};
