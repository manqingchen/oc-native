import { useState, useEffect, useCallback } from 'react';
import { pushNotificationService, PushNotificationConfig } from '@/services/push-notification.service';
import { useUserStore } from '@/api/request';
import i18n from '@/messages/i18n';
import { setPushToken } from '@/api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import * as Clipboard from "expo-clipboard";
import { usePushNotificationStore } from '@/stores/pushNotification.store';

// Persistent device UUID for push registration
const DEVICE_UUID_KEY = 'oc_device_uuid';
const generateUUID = (): string => {
  // Simple RFC4122 version 4 UUID generator
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
const getOrCreateDeviceUUID = async (): Promise<string> => {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_UUID_KEY);
    if (existing) return existing;
    const created = generateUUID();
    await AsyncStorage.setItem(DEVICE_UUID_KEY, created);
    return created;
  } catch {
    // Fallback: non-persistent UUID if storage fails
    return generateUUID();
  }
};


export interface PushNotificationState {
  isInitialized: boolean;
  hasPermission: boolean;
  pushToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface UsePushNotificationsReturn extends PushNotificationState {
  initializePush: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  sendTestNotification: (config: PushNotificationConfig) => Promise<void>;
  refreshToken: () => Promise<string | null>;
  clearBadge: () => Promise<void>;
  getPermissionStatus: () => Promise<string>;
}

/**
 * 推送通知Hook
 * 提供推送通知的完整功能封装
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const { isInitialized, hasPermission, pushToken, isLoading, error, update } = usePushNotificationStore();

  // 仅使用 selector 订阅，避免闭包问题
  const authToken = useUserStore(state => state.token);
  // console.log('authToken in usePushNotifications', authToken)

  /**
   * 更新状态的辅助函数
   */
  const updateState = useCallback((updates: Partial<PushNotificationState>) => {
    update(updates);
  }, [update]);

  /**
   * 初始化推送服务
   */
  const initializePush = useCallback(async () => {
    if (isInitialized) {
      console.log('推送服务已经初始化');
      console.log('authToken', authToken)
      return;
    }

    updateState({ isLoading: true, error: null });

    try {
      // 初始化推送服务
      await pushNotificationService.initialize();

      // 获取权限状态
      const permissionStatus = await pushNotificationService.getPermissionStatus();
      const hasPermission = permissionStatus === 'granted';

      // 获取推送令牌
      const token = pushNotificationService.getCurrentToken();
      console.log('token ===================>>>>>>>>>>> ', token);

      updateState({
        isInitialized: true,
        hasPermission,
        pushToken: token,
        isLoading: false,
      });

      // 如果有令牌且用户已登录，发送到后端
      if (token && authToken) {
        await sendTokenToBackend(token);
      }

      console.log('✅ 推送Hook初始化成功');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '推送初始化失败';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      console.error('❌ 推送Hook初始化失败:', error);
    }
  }, [isInitialized, authToken]);

  /**
   * 请求推送权限
   */
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    updateState({ isLoading: true, error: null });

    try {
      const granted = await pushNotificationService.requestPermissions();

      updateState({
        hasPermission: granted,
        isLoading: false,
      });

      if (granted) {
        // 权限获取成功后，尝试获取令牌
        const token = await pushNotificationService.getExpoPushToken();
        updateState({ pushToken: token });

        // 发送令牌到后端
        if (token && authToken) {
          await sendTokenToBackend(token);
        }
      }

      return granted;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '权限请求失败';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      console.error('权限请求失败:', error);
      return false;
    }
  }, [authToken]);

  /**
   * 发送测试通知
   */
  const sendTestNotification = useCallback(async (config: PushNotificationConfig) => {
    try {
      await pushNotificationService.sendLocalNotification(config);
      console.log('测试通知发送成功');
    } catch (error) {
      console.error('测试通知发送失败:', error);
      throw error;
    }
  }, []);

  /**
   * 刷新推送令牌
   */
  const refreshToken = useCallback(async (): Promise<string | null> => {
    updateState({ isLoading: true, error: null });

    try {
      const token = await pushNotificationService.getExpoPushToken();
      updateState({
        pushToken: token,
        isLoading: false,
      });

      // 发送新令牌到后端
      if (token && authToken) {
        await sendTokenToBackend(token);
      }

      return token;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '令牌刷新失败';
      updateState({
        isLoading: false,
        error: errorMessage,
      });
      console.error('令牌刷新失败:', error);
      return null;
    }
  }, [authToken]);

  /**
   * 清除通知徽章
   */
  const clearBadge = useCallback(async () => {
    try {
      await pushNotificationService.clearBadge();
    } catch (error) {
      console.error('清除徽章失败:', error);
    }
  }, []);

  /**
   * 获取权限状态
   */
  const getPermissionStatus = useCallback(async (): Promise<string> => {
    return await pushNotificationService.getPermissionStatus();
  }, []);

  /**
   * 发送推送令牌到后端
   */
  const sendTokenToBackend = useCallback(async (deviceToken: string) => {
    try {
      if (!authToken) return; // 未登录不发送

      // 使用持久化的设备UUID作为 deviceName
      const deviceName = await getOrCreateDeviceUUID();

      const language = i18n.language || 'en';

      console.log('📤 发送推送令牌到后端:', { token: deviceToken, deviceName, language });

      const data = await setPushToken({
        deviceToken,
        deviceName,
        language,
      });
      Alert.alert(
        '推送令牌',
        JSON.stringify(data, null, 2),
        [
          { text: '关闭', style: 'cancel' },
          {
            text: '复制', onPress: async () => {
              await Clipboard.setStringAsync(JSON.stringify(data));
            }
          }
        ]
      );
      console.log('✅ 推送令牌已发送到后端');
    } catch (error) {
      console.error('❌ 发送推送令牌到后端失败:', error);
      // 静默处理，不阻塞主流程
    }
  }, [authToken]);

  /**
   * 用户登录状态变化时的处理
   * 1) 监听 pushToken 变化（在已有登录态下）
   * 2) 额外订阅 userStore.token 变化，确保登录后一定触发
   */
  useEffect(() => {
    // pushToken 变化时，如果已经登录则发送
    console.log('用户登录状态变化时的处理', authToken,'pushToken', pushToken, !error)
    if (authToken && pushToken && !error) {
      sendTokenToBackend(pushToken);
    }
  }, [authToken, pushToken, error, sendTokenToBackend]);

  useEffect(() => {
    // 订阅 token 变化，避免某些场景下 React 依赖未触发的问题
    const unsubscribe = useUserStore.subscribe((state) => {
      const newToken = state.token;
      if (newToken && pushToken && !error) {
        sendTokenToBackend(pushToken);
      }
    });
    return unsubscribe;
  }, [pushToken, error, sendTokenToBackend]);

  /**
   * 组件卸载时清理
   */
  useEffect(() => {
    return () => {
      pushNotificationService.cleanup();
    };
  }, []);

  return {
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
  };
}

/**
 * 简化版Hook，只用于获取推送状态
 */
export function usePushNotificationStatus() {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await pushNotificationService.getPermissionStatus();
      setHasPermission(status === 'granted');

      if (status === 'granted') {
        const token = pushNotificationService.getCurrentToken();
        setPushToken(token);
      }
    };

    checkStatus();
  }, []);

  return {
    hasPermission,
    pushToken,
  };
}
