import { useState, useEffect, useCallback } from 'react';
import { pushNotificationService, PushNotificationConfig } from '@/services/push-notification.service';
import { useUserStore } from '@/api/request';
import i18n from '@/messages/i18n';
import { setPushToken } from '@/api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [state, setState] = useState<PushNotificationState>({
    isInitialized: false,
    hasPermission: false,
    pushToken: null,
    isLoading: false,
    error: null,
  });

  // 获取用户信息，用于后续发送令牌到后端
  const userStore = useUserStore();

  /**
   * 更新状态的辅助函数
   */
  const updateState = useCallback((updates: Partial<PushNotificationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * 初始化推送服务
   */
  const initializePush = useCallback(async () => {
    if (state.isInitialized) {
      console.log('推送服务已经初始化');
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

      updateState({
        isInitialized: true,
        hasPermission,
        pushToken: token,
        isLoading: false,
      });

      // 如果有令牌且用户已登录，发送到后端
      if (token && userStore.token) {
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
  }, [state.isInitialized, userStore.token]);

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
        if (token && userStore.token) {
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
  }, [userStore.token]);

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
      if (token && userStore.token) {
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
  }, [userStore.token]);

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
  const sendTokenToBackend = useCallback(async (token: string) => {
    try {
      if (!userStore.token) return; // 未登录不发送

      // 使用持久化的设备UUID作为 deviceName
      const deviceName = await getOrCreateDeviceUUID();

      const language = i18n.language || 'en';

      console.log('📤 发送推送令牌到后端:', { token, deviceName, language });

      await setPushToken({
        deviceToken: token,
        deviceName,
        language,
      });

      console.log('✅ 推送令牌已发送到后端');
    } catch (error) {
      console.error('❌ 发送推送令牌到后端失败:', error);
      // 静默处理，不阻塞主流程
    }
  }, [userStore.token]);

  /**
   * 用户登录状态变化时的处理
   */
  useEffect(() => {
    if (userStore.token && state.pushToken && !state.error) {
      // 用户登录且有推送令牌时，发送到后端
      sendTokenToBackend(state.pushToken);
    }
  }, [userStore.token, state.pushToken, state.error, sendTokenToBackend]);
  /**
   * 语言切换后，同步推送令牌（如果已登录且有令牌）
   */
  useEffect(() => {
    if (userStore.token && state.pushToken) {
      sendTokenToBackend(state.pushToken);
    }
  }, [userStore.token, state.pushToken, sendTokenToBackend, i18n.language]);


  /**
   * 组件卸载时清理
   */
  useEffect(() => {
    return () => {
      pushNotificationService.cleanup();
    };
  }, []);

  return {
    ...state,
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
