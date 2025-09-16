import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { 
  Box, 
  Text, 
  Heading, 
  Button, 
  ButtonText,
  GluestackUIProvider 
} from '@/components/ui';
import { BiometricAuthButton, BiometricStatusIndicator } from '@/components/biometric/BiometricAuthButton';
import { BiometricSettings } from '@/components/biometric/BiometricSettings';
import { useBiometricAuth, type StoredCredentials } from '@/hooks/useBiometricAuth';
import { useTranslation } from 'react-i18next';
import { usePhantomWallet } from '@/stores/phantomWalletStore';
import { Ionicons } from '@expo/vector-icons';

export default function BiometricDemo() {
  const { t } = useTranslation();
  const { wallet } = usePhantomWallet();
  const {
    isSupported,
    isEnrolled,
    isEnabled,
    supportedTypes,
    checkBiometricSupport,
    authenticate,
    enableBiometric,
    getAuthTypeDescription,
  } = useBiometricAuth();

  const [demoCredentials, setDemoCredentials] = useState<StoredCredentials>({
    username: 'demo_user',
    token: 'demo_token_12345',
    walletAddress: wallet?.address || 'demo_wallet_address',
    timestamp: Date.now(),
  });

  const [authResult, setAuthResult] = useState<string>('');
  const [lastAction, setLastAction] = useState<string>('');

  // 更新演示凭证
  useEffect(() => {
    if (wallet?.address) {
      setDemoCredentials(prev => ({
        ...prev,
        walletAddress: wallet.address,
        timestamp: Date.now(),
      }));
    }
  }, [wallet?.address]);

  // 处理认证成功
  const handleAuthSuccess = (credentials: any) => {
    setAuthResult(`✅ 认证成功！获取到凭证: ${JSON.stringify(credentials, null, 2)}`);
    setLastAction('authenticate_success');
    
    Alert.alert(
      t('biometric.success.title', 'Authentication Success'),
      t('biometric.success.message', 'Biometric authentication completed successfully!'),
      [{ text: t('common.ok', 'OK') }]
    );
  };

  // 处理认证失败
  const handleAuthError = (error: string) => {
    setAuthResult(`❌ 认证失败: ${error}`);
    setLastAction('authenticate_error');
  };

  // 处理设置变更
  const handleSettingsChange = (enabled: boolean) => {
    setLastAction(enabled ? 'biometric_enabled' : 'biometric_disabled');
    setAuthResult(enabled ? '✅ 生物识别已启用' : '⚠️ 生物识别已禁用');
  };

  // 测试基本认证
  const testBasicAuth = async () => {
    try {
      setLastAction('test_basic_auth');
      const result = await authenticate('测试基本认证功能');
      
      if (result.success) {
        setAuthResult('✅ 基本认证测试成功');
        Alert.alert('测试成功', '基本认证功能正常工作');
      } else {
        setAuthResult(`❌ 基本认证测试失败: ${result.error}`);
        Alert.alert('测试失败', result.error || '认证失败');
      }
    } catch (error: any) {
      setAuthResult(`❌ 基本认证测试异常: ${error.message}`);
      Alert.alert('测试异常', error.message);
    }
  };

  // 测试启用生物识别
  const testEnableBiometric = async () => {
    try {
      setLastAction('test_enable');
      const success = await enableBiometric(demoCredentials);
      
      if (success) {
        setAuthResult('✅ 生物识别启用测试成功');
        Alert.alert('测试成功', '生物识别已成功启用');
      } else {
        setAuthResult('❌ 生物识别启用测试失败');
        Alert.alert('测试失败', '无法启用生物识别');
      }
    } catch (error: any) {
      setAuthResult(`❌ 启用测试异常: ${error.message}`);
      Alert.alert('测试异常', error.message);
    }
  };

  // 刷新状态
  const refreshStatus = async () => {
    setLastAction('refresh_status');
    await checkBiometricSupport();
    setAuthResult('🔄 状态已刷新');
  };

  return (
    <GluestackUIProvider mode="light">
      <ScrollView className="flex-1 bg-gray-50">
        <Box className="p-6">
          {/* 标题 */}
          <Box className="mb-8">
            <Heading size="2xl" className="mb-2 text-gray-900">
              🔐 生物识别认证演示
            </Heading>
            <Text className="text-gray-600 text-base">
              测试和演示生物识别认证功能的各种场景
            </Text>
          </Box>

          {/* 当前状态 */}
          <Box className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="md" className="mb-3 text-gray-900">
              📊 当前状态
            </Heading>
            <BiometricStatusIndicator />
            
            <Box className="mt-4 space-y-2">
              <Text className="text-sm text-gray-600">
                支持的认证类型: {getAuthTypeDescription(supportedTypes)}
              </Text>
              <Text className="text-sm text-gray-600">
                硬件支持: {isSupported ? '✅ 是' : '❌ 否'}
              </Text>
              <Text className="text-sm text-gray-600">
                已注册生物识别: {isEnrolled ? '✅ 是' : '❌ 否'}
              </Text>
              <Text className="text-sm text-gray-600">
                应用内已启用: {isEnabled ? '✅ 是' : '❌ 否'}
              </Text>
            </Box>
          </Box>

          {/* 快速测试按钮 */}
          <Box className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="md" className="mb-4 text-gray-900">
              🧪 快速测试
            </Heading>
            
            <Box className="space-y-3">
              <Button
                variant="outline"
                onPress={refreshStatus}
                className="w-full"
              >
                <ButtonText>🔄 刷新状态</ButtonText>
              </Button>

              <Button
                variant="outline"
                onPress={testBasicAuth}
                disabled={!isSupported || !isEnrolled}
                className="w-full"
              >
                <ButtonText>🔍 测试基本认证</ButtonText>
              </Button>

              <Button
                variant="outline"
                onPress={testEnableBiometric}
                disabled={!isSupported || !isEnrolled || isEnabled}
                className="w-full"
              >
                <ButtonText>⚙️ 测试启用生物识别</ButtonText>
              </Button>
            </Box>
          </Box>

          {/* 生物识别认证按钮演示 */}
          <Box className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="md" className="mb-4 text-gray-900">
              🎯 认证按钮演示
            </Heading>
            
            <Box className="space-y-4">
              <Box>
                <Text className="text-sm text-gray-600 mb-2">标准按钮:</Text>
                <BiometricAuthButton
                  onSuccess={handleAuthSuccess}
                  onError={handleAuthError}
                  variant="solid"
                  size="md"
                />
              </Box>

              <Box>
                <Text className="text-sm text-gray-600 mb-2">轮廓按钮:</Text>
                <BiometricAuthButton
                  onSuccess={handleAuthSuccess}
                  onError={handleAuthError}
                  variant="outline"
                  size="md"
                />
              </Box>

              <Box>
                <Text className="text-sm text-gray-600 mb-2">小尺寸按钮:</Text>
                <BiometricAuthButton
                  onSuccess={handleAuthSuccess}
                  onError={handleAuthError}
                  variant="solid"
                  size="sm"
                />
              </Box>

              <Box>
                <Text className="text-sm text-gray-600 mb-2">仅图标按钮:</Text>
                <BiometricAuthButton
                  onSuccess={handleAuthSuccess}
                  onError={handleAuthError}
                  variant="outline"
                  size="md"
                  showText={false}
                />
              </Box>
            </Box>
          </Box>

          {/* 生物识别设置 */}
          <Box className="mb-6">
            <BiometricSettings
              userCredentials={demoCredentials}
              onSettingsChange={handleSettingsChange}
            />
          </Box>

          {/* 操作结果 */}
          <Box className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="md" className="mb-3 text-gray-900">
              📝 操作结果
            </Heading>
            
            <Box className="p-3 bg-gray-50 rounded-lg">
              <Text className="text-xs text-gray-500 mb-1">
                最后操作: {lastAction || '无'}
              </Text>
              <Text className="text-sm text-gray-700 font-mono">
                {authResult || '暂无结果'}
              </Text>
            </Box>
          </Box>

          {/* 演示凭证信息 */}
          <Box className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <Heading size="md" className="mb-3 text-gray-900">
              🔑 演示凭证
            </Heading>
            
            <Box className="p-3 bg-gray-50 rounded-lg">
              <Text className="text-xs text-gray-700 font-mono">
                {JSON.stringify(demoCredentials, null, 2)}
              </Text>
            </Box>
          </Box>

          {/* 使用说明 */}
          <Box className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Heading size="sm" className="mb-2 text-blue-800">
              📖 使用说明
            </Heading>
            <Text className="text-blue-700 text-sm mb-2">
              1. 确保设备支持并已设置生物识别认证
            </Text>
            <Text className="text-blue-700 text-sm mb-2">
              2. 使用"测试启用生物识别"按钮启用功能
            </Text>
            <Text className="text-blue-700 text-sm mb-2">
              3. 点击认证按钮测试生物识别登录
            </Text>
            <Text className="text-blue-700 text-sm">
              4. 在设置中可以管理生物识别功能的开关
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </GluestackUIProvider>
  );
}
