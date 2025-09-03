import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Box, Text, Button, ButtonText, Toast, ToastTitle, useToast, Input } from '@/components/ui';
import { MobileCommonBar } from '@/components/nav/mobile.common.bar';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { PUSH_NOTIFICATION_CONFIG } from '@/lib/config';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/api/request';
import { PushTestHelper } from '@/utils/push-test-helper';

export default function PushTestPage() {
  const { t } = useTranslation();
  const toast = useToast();
  const language = useUserStore(state => state.language);

  // 外部推送测试状态
  const [externalToken, setExternalToken] = useState('');
  const [customTitle, setCustomTitle] = useState('测试推送');
  const [customBody, setCustomBody] = useState('这是一条测试消息');
  const [isSendingExternal, setIsSendingExternal] = useState(false);
  
  const {
    isInitialized,
    hasPermission,
    pushToken,
    isLoading,
    error,
    initializePush,
    requestPermissions,
    sendTestNotification,
    refreshToken,
    clearBadge,
    getPermissionStatus,
  } = usePushNotifications();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast.show({
      placement: 'top',
      render: () => (
        <Toast action={type} variant="solid">
          <ToastTitle>{message}</ToastTitle>
        </Toast>
      ),
      duration: 3000,
    });
  };

  const handleInitialize = async () => {
    try {
      await initializePush();
      showToast('推送服务初始化成功');
    } catch (error) {
      showToast('推送服务初始化失败', 'error');
    }
  };

  const handleRequestPermissions = async () => {
    try {
      const granted = await requestPermissions();
      if (granted) {
        showToast('推送权限获取成功');
      } else {
        showToast('推送权限被拒绝', 'error');
      }
    } catch (error) {
      showToast('权限请求失败', 'error');
    }
  };

  const handleSendTestNotification = async (messageType: string) => {
    try {
      const langKey = language === 0 ? 'zh' : 'en';
      const messages = PUSH_NOTIFICATION_CONFIG.MESSAGES as any;
      const message = messages[messageType]?.[langKey];
      
      if (!message) {
        showToast('消息模板不存在', 'error');
        return;
      }

      await sendTestNotification({
        title: message.title,
        body: message.body,
        data: {
          screen: 'transaction',
          type: messageType.toLowerCase(),
          orderId: 'test-' + Date.now(),
        },
      });
      
      showToast('测试推送发送成功');
    } catch (error) {
      showToast('测试推送发送失败', 'error');
    }
  };

  const handleRefreshToken = async () => {
    try {
      const token = await refreshToken();
      if (token) {
        showToast('推送令牌刷新成功');
      } else {
        showToast('推送令牌刷新失败', 'error');
      }
    } catch (error) {
      showToast('推送令牌刷新失败', 'error');
    }
  };

  const handleClearBadge = async () => {
    try {
      await clearBadge();
      showToast('徽章清除成功');
    } catch (error) {
      showToast('徽章清除失败', 'error');
    }
  };

  const handleCheckPermissionStatus = async () => {
    try {
      const status = await getPermissionStatus();
      showToast(`当前权限状态: ${status}`);
    } catch (error) {
      showToast('权限状态检查失败', 'error');
    }
  };

  // 发送外部推送（使用Expo Push API）
  const handleSendExternalPush = async () => {
    if (!externalToken) {
      showToast('请输入推送令牌', 'error');
      return;
    }

    if (!PushTestHelper.isValidExpoPushToken(externalToken)) {
      showToast('推送令牌格式无效', 'error');
      return;
    }

    setIsSendingExternal(true);

    try {
      const message = PushTestHelper.createCustomMessage(
        externalToken,
        customTitle,
        customBody,
        {
          screen: 'transaction',
          type: 'external_test',
          timestamp: Date.now()
        }
      );

      const result = await PushTestHelper.sendPushNotification(message);

      if (result.data?.status === 'ok') {
        showToast('外部推送发送成功！');
      } else {
        const errorMsg = result.errors?.[0]?.message || '推送发送失败';
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      showToast('外部推送发送失败', 'error');
    } finally {
      setIsSendingExternal(false);
    }
  };

  // 复制当前推送令牌
  const handleCopyToken = () => {
    if (pushToken) {
      // 在Web环境下使用navigator.clipboard，在React Native中需要使用Clipboard
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(pushToken);
        showToast('推送令牌已复制到剪贴板');
      } else {
        // 显示令牌供手动复制
        Alert.alert(
          '推送令牌',
          pushToken,
          [
            { text: '关闭', style: 'cancel' },
            { text: '复制', onPress: () => showToast('请手动复制令牌') }
          ]
        );
      }
    } else {
      showToast('没有可用的推送令牌', 'error');
    }
  };

  // 使用当前令牌填充外部测试
  const handleUseCurrentToken = () => {
    if (pushToken) {
      setExternalToken(pushToken);
      showToast('已使用当前推送令牌');
    } else {
      showToast('当前没有推送令牌', 'error');
    }
  };

  return (
    <Box className="flex flex-col h-screen">
      <MobileCommonBar title="推送测试" />
      <ScrollView className="flex-1 px-5">
        <Box className="flex flex-col gap-5 py-5">
          
          {/* 状态信息 */}
          <Box className="bg-white rounded-lg p-4">
            <Text className="text-lg font-bold mb-3">推送状态</Text>
            <Text className="mb-2">初始化状态: {isInitialized ? '✅ 已初始化' : '❌ 未初始化'}</Text>
            <Text className="mb-2">权限状态: {hasPermission ? '✅ 已授权' : '❌ 未授权'}</Text>
            <Text className="mb-2">加载状态: {isLoading ? '🔄 加载中' : '✅ 空闲'}</Text>
            {error && <Text className="mb-2 text-red-500">错误: {error}</Text>}
            {pushToken && (
              <Box className="mt-2">
                <Text className="font-semibold">推送令牌:</Text>
                <Text className="text-xs text-gray-600 break-all">{PushTestHelper.formatTokenForDisplay(pushToken)}</Text>
                <Button onPress={handleCopyToken} className="mt-2 bg-gray-500" size="sm">
                  <ButtonText>复制完整令牌</ButtonText>
                </Button>
              </Box>
            )}
          </Box>

          {/* 基础操作 */}
          <Box className="bg-white rounded-lg p-4">
            <Text className="text-lg font-bold mb-3">基础操作</Text>
            <Box className="flex flex-col gap-3">
              <Button onPress={handleInitialize} disabled={isLoading}>
                <ButtonText>初始化推送服务</ButtonText>
              </Button>
              
              <Button onPress={handleRequestPermissions} disabled={isLoading}>
                <ButtonText>请求推送权限</ButtonText>
              </Button>
              
              <Button onPress={handleRefreshToken} disabled={isLoading}>
                <ButtonText>刷新推送令牌</ButtonText>
              </Button>
              
              <Button onPress={handleCheckPermissionStatus} disabled={isLoading}>
                <ButtonText>检查权限状态</ButtonText>
              </Button>
              
              <Button onPress={handleClearBadge} disabled={isLoading}>
                <ButtonText>清除应用徽章</ButtonText>
              </Button>
            </Box>
          </Box>

          {/* 测试推送 */}
          <Box className="bg-white rounded-lg p-4">
            <Text className="text-lg font-bold mb-3">测试推送</Text>
            <Box className="flex flex-col gap-3">
              <Button 
                onPress={() => handleSendTestNotification('SUBSCRIPTION_COMPLETE')}
                disabled={isLoading || !hasPermission}
                className="bg-green-500"
              >
                <ButtonText>测试申购完成推送</ButtonText>
              </Button>
              
              <Button 
                onPress={() => handleSendTestNotification('REDEMPTION_COMPLETE')}
                disabled={isLoading || !hasPermission}
                className="bg-blue-500"
              >
                <ButtonText>测试赎回完成推送</ButtonText>
              </Button>
              
              <Button 
                onPress={() => handleSendTestNotification('IDENTITY_SUCCESS')}
                disabled={isLoading || !hasPermission}
                className="bg-purple-500"
              >
                <ButtonText>测试身份认证成功推送</ButtonText>
              </Button>
              
              <Button 
                onPress={() => handleSendTestNotification('STATEMENT_GENERATED')}
                disabled={isLoading || !hasPermission}
                className="bg-orange-500"
              >
                <ButtonText>测试结单生成推送</ButtonText>
              </Button>
            </Box>
          </Box>

          {/* 外部推送测试 */}
          <Box className="bg-white rounded-lg p-4">
            <Text className="text-lg font-bold mb-3">外部推送测试</Text>
            <Text className="text-sm text-gray-600 mb-3">
              使用Expo Push API直接发送推送，可以测试真实的推送流程
            </Text>

            <Box className="flex flex-col gap-3">
              <Box>
                <Text className="font-semibold mb-1">推送令牌:</Text>
                <Input
                  placeholder="ExponentPushToken[...]"
                  value={externalToken}
                  onChangeText={setExternalToken}
                  type="address"
                />
                <Button
                  onPress={handleUseCurrentToken}
                  className="mt-2 bg-gray-500"
                  size="sm"
                  disabled={!pushToken}
                >
                  <ButtonText>使用当前令牌</ButtonText>
                </Button>
              </Box>

              <Box>
                <Text className="font-semibold mb-1">推送标题:</Text>
                <Input
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  placeholder="推送标题"
                  type="address"
                />
              </Box>

              <Box>
                <Text className="font-semibold mb-1">推送内容:</Text>
                <Input
                  value={customBody}
                  onChangeText={setCustomBody}
                  placeholder="推送内容"
                  type="address"
                />
              </Box>

              <Button
                onPress={handleSendExternalPush}
                disabled={isSendingExternal || !externalToken}
                className="bg-red-500"
              >
                <ButtonText>
                  {isSendingExternal ? '发送中...' : '🚀 发送外部推送'}
                </ButtonText>
              </Button>
            </Box>
          </Box>

          {/* 使用说明 */}
          <Box className="bg-gray-100 rounded-lg p-4">
            <Text className="text-lg font-bold mb-3">使用说明</Text>
            <Text className="text-sm text-gray-700 leading-5">
              <Text className="font-semibold">本地推送测试:{'\n'}</Text>
              1. 点击"初始化推送服务"初始化推送功能{'\n'}
              2. 点击"请求推送权限"获取推送权限{'\n'}
              3. 权限获取成功后，可以测试各种类型的推送{'\n'}
              4. 点击推送通知会跳转到对应页面{'\n\n'}

              <Text className="font-semibold">外部推送测试:{'\n'}</Text>
              1. 复制推送令牌到外部测试区域{'\n'}
              2. 自定义推送标题和内容{'\n'}
              3. 点击"发送外部推送"测试真实推送{'\n'}
              4. 这会通过Expo Push API发送真实推送{'\n\n'}

              <Text className="font-semibold">注意事项:{'\n'}</Text>
              • 推送通知只在真实设备上工作{'\n'}
              • 确保设备有网络连接{'\n'}
              • 外部推送会消耗Expo的免费额度
            </Text>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
