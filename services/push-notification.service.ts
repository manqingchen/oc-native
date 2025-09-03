import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { router } from 'expo-router';

// 推送通知配置
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PushNotificationData {
  screen?: string;
  type?: string;
  orderId?: string;
  [key: string]: any;
}

export interface PushNotificationConfig {
  title: string;
  body: string;
  data?: PushNotificationData;
}

class PushNotificationService {
  private expoPushToken: string | null = null;
  private notificationListener: any = null;
  private responseListener: any = null;

  /**
   * 初始化推送服务
   */
  async initialize(): Promise<void> {
    try {
      // 检查设备是否支持推送
      if (!Device.isDevice) {
        console.warn('推送通知只在真实设备上工作');
        return;
      }

      // 获取推送权限
      const permission = await this.requestPermissions();
      if (!permission) {
        console.warn('用户拒绝了推送权限');
        return;
      }

      // 获取推送令牌
      await this.getExpoPushToken();

      // 设置通知监听器
      this.setupNotificationListeners();

      console.log('✅ 推送服务初始化成功');
    } catch (error) {
      console.error('❌ 推送服务初始化失败:', error);
    }
  }

  /**
   * 请求推送权限
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('推送权限被拒绝');
        return false;
      }

      // Android 特殊配置
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FE5F00',
        });
      }

      return true;
    } catch (error) {
      console.error('请求推送权限失败:', error);
      return false;
    }
  }

  /**
   * 获取Expo推送令牌
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      
      if (!projectId) {
        console.error('未找到Expo项目ID，请在app.json中配置');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.expoPushToken = token.data;
      console.log('📱 获取到推送令牌:', this.expoPushToken);
      
      return this.expoPushToken;
    } catch (error) {
      console.error('获取推送令牌失败:', error);
      return null;
    }
  }

  /**
   * 设置通知监听器
   */
  private setupNotificationListeners(): void {
    // 应用在前台时收到通知
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📨 收到推送通知:', notification);
        this.handleNotificationReceived(notification);
      }
    );

    // 用户点击通知时
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('👆 用户点击了推送通知:', response);
        this.handleNotificationResponse(response);
      }
    );
  }

  /**
   * 处理收到的通知（应用在前台时）
   */
  private handleNotificationReceived(notification: Notifications.Notification): void {
    const data = notification.request.content.data as PushNotificationData;
    
    // 可以在这里显示应用内通知或更新UI
    console.log('处理前台通知:', data);
  }

  /**
   * 处理用户点击通知
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data as PushNotificationData;
    
    // 根据通知数据进行页面跳转
    this.navigateToScreen(data);
  }

  /**
   * 根据通知数据导航到对应页面
   */
  private navigateToScreen(data: PushNotificationData): void {
    try {
      if (data.screen) {
        switch (data.screen) {
          case 'transaction':
            router.push('/transaction');
            break;
          case 'system-message':
            router.push('/system-message');
            break;
          default:
            console.warn('未知的跳转页面:', data.screen);
        }
      }
    } catch (error) {
      console.error('页面跳转失败:', error);
    }
  }

  /**
   * 发送本地测试通知
   */
  async sendLocalNotification(config: PushNotificationConfig): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: config.data || {},
          sound: 'default',
        },
        trigger: null, // 立即发送
      });
    } catch (error) {
      console.error('发送本地通知失败:', error);
    }
  }

  /**
   * 获取当前推送令牌
   */
  getCurrentToken(): string | null {
    return this.expoPushToken;
  }

  /**
   * 检查推送权限状态
   */
  async getPermissionStatus(): Promise<string> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  /**
   * 清理监听器
   */
  cleanup(): void {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  /**
   * 清除所有通知徽章
   */
  async clearBadge(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('清除徽章失败:', error);
    }
  }

  /**
   * 取消所有待发送的本地通知
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('取消通知失败:', error);
    }
  }
}

// 导出单例实例
export const pushNotificationService = new PushNotificationService();

// 导出类型
export type { PushNotificationData, PushNotificationConfig };

// 导出服务类
export default PushNotificationService;
