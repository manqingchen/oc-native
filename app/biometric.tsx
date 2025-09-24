import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Box, Text, Heading, Button, ButtonText } from '@/components/ui';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { useTranslation } from 'react-i18next';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useBiometricStore } from '@/stores/biometricStore';

export default function BiometricEntry() {
  const { t } = useTranslation();
  const { isSupported, isEnrolled, isEnabled, supportedTypes, authenticate, getAuthTypeDescription } = useBiometricAuth();
  const { isAppLockEnabled, setAppLockEnabled, updateLastAuthTime } = useBiometricStore();

  const [busy, setBusy] = useState(false);

  const authTypeText = useMemo(() => getAuthTypeDescription(supportedTypes), [getAuthTypeDescription, supportedTypes]);

  const handleEnableAppLock = useCallback(async () => {
    if (!isSupported) {
      Alert.alert(t('biometric.error.title', '错误'), t('biometric.error.noHardware', '当前设备不支持生物识别'));
      return;
    }
    if (!isEnrolled) {
      Alert.alert(t('biometric.error.title', '错误'), t('biometric.error.notEnrolled', '设备未设置生物识别'));
      return;
    }


    setBusy(true);
    try {
      const result = await authenticate(t('biometric.prompt.enableAppLock', '请进行生物识别以启用应用锁'));
      if (result.success) {
        setAppLockEnabled(true);
        Alert.alert(t('biometric.success.title', '成功'), t('biometric.success.appLockEnabled', '已启用应用锁'));
      } else {
        Alert.alert(t('biometric.error.title', '错误'), result.error || t('biometric.error.authFailed', '认证失败'));
      }
    } finally {
      setBusy(false);
    }
  }, [authenticate, isSupported, isEnrolled, isEnabled, setAppLockEnabled, t]);

  const handleDisableAppLock = useCallback(() => {
    setAppLockEnabled(false);
    Alert.alert(t('biometric.success.title', '成功'), t('biometric.success.disabled', '已关闭应用锁'));
  }, [setAppLockEnabled, t]);

  const handleQuickAuth = useCallback(async () => {
    setBusy(true);
    try {
      const result = await authenticate(t('biometric.guard.prompt', '请进行生物识别以继续'));
      if (result.success) {
        updateLastAuthTime();
        Alert.alert(t('biometric.success.title', '成功'), t('biometric.success.message', '认证通过'));
      } else {
        Alert.alert(t('biometric.error.title', '错误'), result.error || t('biometric.error.authFailed', '认证失败'));
      }
    } finally {
      setBusy(false);
    }
  }, [authenticate, updateLastAuthTime, t]);

  return (
    <GluestackUIProvider mode="light">
      <ScrollView className="flex-1 bg-gray-50">
        <Box className="p-6 gap-6">
          {/* 标题 */}
          <Box>
            <Heading size="2xl" className="text-gray-900 mb-2">🔐 生物识别</Heading>
            <Text className="text-gray-600">开启应用锁后：每次进入或从后台回到前台，均需通过生物识别认证。</Text>
          </Box>

          {/* 当前状态 */}
          <Box className="p-4 bg-white rounded-xl shadow-sm gap-2">
            <Heading size="md" className="text-gray-900 mb-2">当前状态</Heading>
            <Text className="text-sm text-gray-700">认证类型：{authTypeText}</Text>
            <Text className="text-sm text-gray-700">硬件支持：{isSupported ? '✅ 是' : '❌ 否'}</Text>
            <Text className="text-sm text-gray-700">设备已录入：{isEnrolled ? '✅ 是' : '❌ 否'}</Text>
            <Text className="text-sm text-gray-700">应用内启用（凭证存储）：{isEnabled ? '✅ 是' : '❌ 否'}</Text>
            <Text className="text-sm text-gray-700">应用锁状态：{isAppLockEnabled ? '🔒 已启用' : '🔓 未启用'}</Text>
          </Box>

          {/* 操作 */}
          <Box className="gap-3">
            {!isAppLockEnabled ? (
              <Button onPress={handleEnableAppLock} disabled={busy} className="rounded-xl h-12">
                <ButtonText>{busy ? '请稍候...' : '启用应用锁'}</ButtonText>
              </Button>
            ) : (
              <Button onPress={handleDisableAppLock} variant="outline" disabled={busy} className="rounded-xl h-12">
                <ButtonText className="text-red-600">关闭应用锁</ButtonText>
              </Button>
            )}

            <Button onPress={handleQuickAuth} variant="outline" disabled={busy} className="rounded-xl h-12">
              <ButtonText>立即验证</ButtonText>
            </Button>
          </Box>

          {/* 说明 */}
          <Box className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Heading size="sm" className="text-blue-800 mb-2">说明</Heading>
            <Text className="text-blue-700 text-sm">1. 开启后，进入 App 或从后台回到前台都会触发生物识别。</Text>
            <Text className="text-blue-700 text-sm">2. 可选：若需要“生物识别快速登录”等功能，再在应用内开启“凭证存储”。</Text>
          </Box>
        </Box>
      </ScrollView>
    </GluestackUIProvider>
  );
}

