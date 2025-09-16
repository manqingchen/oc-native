import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { 
  Box, 
  Text, 
  Switch, 
  Button, 
  ButtonText,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@/components/ui';
import { useBiometricStore } from '@/stores/biometricStore';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useTranslation } from 'react-i18next';
import { BiometricStatusIndicator } from './BiometricAuthButton';

export const BiometricAppSettings: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    isAppLockEnabled,
    requireAuthOnLaunch,
    requireAuthOnBackground,
    authTimeoutMinutes,
    setAppLockEnabled,
    setRequireAuthOnLaunch,
    setRequireAuthOnBackground,
    setAuthTimeout,
    resetSettings,
  } = useBiometricStore();

  const { isSupported, isEnabled, authenticate } = useBiometricAuth();

  // 启用应用锁定
  const handleEnableAppLock = useCallback(async (enabled: boolean) => {
    if (!enabled) {
      // 禁用应用锁定
      setAppLockEnabled(false);
      return;
    }

    // 启用应用锁定前需要验证
    if (!isSupported) {
      Alert.alert(
        t('biometric.error.title', 'Error'),
        t('biometric.error.notSupported', 'Biometric authentication is not supported on this device')
      );
      return;
    }

    if (!isEnabled) {
      Alert.alert(
        t('biometric.error.title', 'Error'),
        t('biometric.error.notEnrolled', 'Please set up biometric authentication in device settings first')
      );
      return;
    }

    setIsLoading(true);
    try {
      const authResult = await authenticate(
        t('biometric.prompt.enableAppLock', 'Authenticate to enable app lock')
      );

      if (authResult.success) {
        setAppLockEnabled(true);
        Alert.alert(
          t('biometric.success.title', 'Success'),
          t('biometric.success.appLockEnabled', 'App lock has been enabled successfully!')
        );
      } else {
        Alert.alert(
          t('biometric.error.title', 'Error'),
          authResult.error || t('biometric.error.authFailed', 'Authentication failed')
        );
      }
    } catch (error: any) {
      Alert.alert(
        t('biometric.error.title', 'Error'),
        error.message || t('biometric.error.unknown', 'Unknown error occurred')
      );
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, isEnabled, authenticate, setAppLockEnabled, t]);

  // 重置所有设置
  const handleResetSettings = useCallback(() => {
    Alert.alert(
      t('biometric.confirm.title', 'Confirm'),
      t('biometric.confirm.resetSettings', 'Are you sure you want to reset all biometric settings?'),
      [
        {
          text: t('biometric.cancel', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('biometric.confirm.reset', 'Reset'),
          style: 'destructive',
          onPress: () => {
            resetSettings();
            Alert.alert(
              t('biometric.success.title', 'Success'),
              t('biometric.success.settingsReset', 'Settings have been reset successfully!')
            );
          },
        },
      ]
    );
  }, [resetSettings, t]);

  return (
    <Box className="p-6 bg-white">
      {/* 标题 */}
      <Box className="mb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {t('biometric.settings.title', 'Biometric App Lock')}
        </Text>
        <Text className="text-base text-gray-600">
          {t('biometric.settings.subtitle', 'Secure your app with biometric authentication')}
        </Text>
      </Box>

      {/* 生物识别状态 */}
      <Box className="mb-6 p-4 bg-gray-50 rounded-xl">
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          {t('biometric.settings.status', 'Biometric Status')}
        </Text>
        <BiometricStatusIndicator />
      </Box>

      {/* 应用锁定设置 */}
      <Box className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          {t('biometric.settings.appLock', 'App Lock Settings')}
        </Text>

        {/* 启用应用锁定 */}
        <SettingItem
          title={t('biometric.settings.enableAppLock', 'Enable App Lock')}
          subtitle={t('biometric.settings.enableAppLockDesc', 'Require biometric authentication to access the app')}
          value={isAppLockEnabled}
          onValueChange={handleEnableAppLock}
          disabled={isLoading || !isSupported || !isEnabled}
        />

        {/* 启动时认证 */}
        {isAppLockEnabled && (
          <SettingItem
            title={t('biometric.settings.authOnLaunch', 'Authenticate on Launch')}
            subtitle={t('biometric.settings.authOnLaunchDesc', 'Require authentication when app starts')}
            value={requireAuthOnLaunch}
            onValueChange={setRequireAuthOnLaunch}
          />
        )}

        {/* 后台返回时认证 */}
        {isAppLockEnabled && (
          <SettingItem
            title={t('biometric.settings.authOnBackground', 'Authenticate on Background Return')}
            subtitle={t('biometric.settings.authOnBackgroundDesc', 'Require authentication when returning from background')}
            value={requireAuthOnBackground}
            onValueChange={setRequireAuthOnBackground}
          />
        )}

        {/* 认证超时设置 */}
        {isAppLockEnabled && (
          <Box className="py-4 border-b border-gray-200">
            <Text className="text-base font-medium text-gray-900 mb-2">
              {t('biometric.settings.authTimeout', 'Authentication Timeout')}
            </Text>
            <Text className="text-sm text-gray-600 mb-4">
              {t('biometric.settings.authTimeoutDesc', 'Time before requiring re-authentication')}: {authTimeoutMinutes} {t('biometric.settings.minutes', 'minutes')}
            </Text>
            <Slider
              value={authTimeoutMinutes}
              onValueChange={(value) => setAuthTimeout(value[0])}
              min={1}
              max={60}
              step={1}
              className="w-full"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>
        )}
      </Box>

      {/* 操作按钮 */}
      <Box className="gap-3">
        <Button
          onPress={handleResetSettings}
          variant="outline"
          className="border-red-300 rounded-xl h-12"
        >
          <ButtonText className="text-red-600 font-medium">
            {t('biometric.settings.resetSettings', 'Reset All Settings')}
          </ButtonText>
        </Button>
      </Box>
    </Box>
  );
};

interface SettingItemProps {
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <Box className="flex-row justify-between items-center py-4 border-b border-gray-200">
      <Box className="flex-1 mr-4">
        <Text className="text-base font-medium text-gray-900 mb-1">
          {title}
        </Text>
        <Text className="text-sm text-gray-600">
          {subtitle}
        </Text>
      </Box>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
        thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
      />
    </Box>
  );
};
