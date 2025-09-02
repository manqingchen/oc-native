import * as Updates from 'expo-updates';
import { Alert, Platform } from 'react-native';
import { showToast } from './toast';
import i18n from '@/messages/i18n';

// 更新类型
export enum UpdateType {
  FORCE = 'force',     // 强更
  OPTIONAL = 'optional' // 弱更
}

// 更新状态
export enum UpdateStatus {
  CHECKING = 'checking',
  AVAILABLE = 'available',
  NOT_AVAILABLE = 'not_available',
  DOWNLOADING = 'downloading',
  READY = 'ready',
  ERROR = 'error'
}

// 更新配置
interface UpdateConfig {
  type: UpdateType;
  version: string;
  description?: string;
  downloadUrl?: string;
  forceUpdate?: boolean;
}

// 更新管理器
export class AppUpdateManager {
  private static instance: AppUpdateManager;
  private updateStatus: UpdateStatus = UpdateStatus.NOT_AVAILABLE;
  private updateConfig: UpdateConfig | null = null;

  static getInstance(): AppUpdateManager {
    if (!AppUpdateManager.instance) {
      AppUpdateManager.instance = new AppUpdateManager();
    }
    return AppUpdateManager.instance;
  }

  // 检查更新
  async checkForUpdates(): Promise<{
    isAvailable: boolean;
    updateInfo?: Updates.UpdateCheckResult;
  }> {
    try {
      if (!Updates.isEnabled) {
        console.log('Updates are not enabled');
        return { isAvailable: false };
      }

      this.updateStatus = UpdateStatus.CHECKING;
      showToast.info(i18n.t('update.checking_updates'));

      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        this.updateStatus = UpdateStatus.AVAILABLE;
        return { isAvailable: true, updateInfo: update };
      } else {
        this.updateStatus = UpdateStatus.NOT_AVAILABLE;
        return { isAvailable: false };
      }
    } catch (error) {
      console.error('检查更新失败:', error);
      this.updateStatus = UpdateStatus.ERROR;
      // showToast.error(i18n.t('update.check_failed'));
      return { isAvailable: false };
    }
  }

  // 下载并安装更新
  async downloadAndInstallUpdate(): Promise<boolean> {
    try {
      this.updateStatus = UpdateStatus.DOWNLOADING;
      showToast.info(i18n.t('update.downloading_update'));

      const result = await Updates.fetchUpdateAsync();
      
      if (result.isNew) {
        this.updateStatus = UpdateStatus.READY;
        showToast.success(i18n.t('update.update_ready'));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('下载更新失败:', error);
      this.updateStatus = UpdateStatus.ERROR;
      showToast.error(i18n.t('update.download_failed'));
      return false;
    }
  }

  // 重启应用以应用更新
  async reloadApp(): Promise<void> {
    try {
      await Updates.reloadAsync();
    } catch (error) {
      console.error('重启应用失败:', error);
      showToast.error(i18n.t('update.restart_failed'));
    }
  }

  // 显示更新对话框
  showUpdateDialog(config: UpdateConfig): void {
    this.updateConfig = config;
    
    const title = config.type === UpdateType.FORCE
      ? i18n.t('update.force_update_title')
      : i18n.t('update.optional_update_title');
    const message = config.description || i18n.t('update.default_update_message');
    
    if (config.type === UpdateType.FORCE) {
      // 强更：只有一个确定按钮
      Alert.alert(
        title,
        message,
        [
          {
            text: i18n.t('update.update_now'),
            onPress: () => this.handleUpdate(),
          }
        ],
        { cancelable: false } // 不可取消
      );
    } else {
      // 弱更：有取消和确定按钮
      Alert.alert(
        title,
        message,
        [
          {
            text: i18n.t('update.remind_later'),
            style: 'cancel',
            onPress: () => this.handleLaterRemind(),
          },
          {
            text: i18n.t('update.update_now'),
            onPress: () => this.handleUpdate(),
          }
        ]
      );
    }
  }

  // 处理更新
  private async handleUpdate(): Promise<void> {
    const success = await this.downloadAndInstallUpdate();
    if (success) {
      // 显示重启确认
      Alert.alert(
        i18n.t('update.update_complete'),
        i18n.t('update.restart_message'),
        [
          {
            text: i18n.t('update.restart_now'),
            onPress: () => this.reloadApp(),
          }
        ],
        { cancelable: false }
      );
    }
  }

  // 处理稍后提醒
  private handleLaterRemind(): void {
    // 可以设置本地存储，记录用户选择稍后提醒的时间
    // 下次启动时可以根据时间间隔再次提醒
    console.log('用户选择稍后提醒');
  }

  // 自动检查并处理更新
  async autoCheckAndUpdate(forceCheck: boolean = false): Promise<void> {
    try {
      const { isAvailable, updateInfo } = await this.checkForUpdates();
      
      if (isAvailable && updateInfo) {
        // 这里可以根据服务器返回的配置决定是强更还是弱更
        // 示例：假设从服务器获取更新配置
        const updateConfig = await this.getUpdateConfigFromServer();
        
        if (updateConfig) {
          this.showUpdateDialog(updateConfig);
        }
      } else if (forceCheck) {
        showToast.info(i18n.t('update.latest_version'));
      }
    } catch (error) {
      console.error('自动检查更新失败:', error);
    }
  }

  // 从服务器获取更新配置（示例）
  private async getUpdateConfigFromServer(): Promise<UpdateConfig | null> {
    try {
      // 这里应该调用你的 API 来获取更新配置
      // const response = await fetch('/api/app-update-config');
      // const config = await response.json();
      
      // 示例配置
      const config: UpdateConfig = {
        type: UpdateType.OPTIONAL, // 或 UpdateType.FORCE
        version: '1.0.1',
        description: '本次更新包含性能优化和bug修复，建议立即更新。',
        forceUpdate: false
      };
      
      return config;
    } catch (error) {
      console.error('获取更新配置失败:', error);
      return null;
    }
  }

  // 获取当前更新状态
  getUpdateStatus(): UpdateStatus {
    return this.updateStatus;
  }

  // 获取当前应用版本信息
  getCurrentVersionInfo() {
    return {
      updateId: Updates.updateId,
      createdAt: Updates.createdAt,
      isEmbeddedLaunch: Updates.isEmbeddedLaunch,
      isEnabled: Updates.isEnabled,
    };
  }
}

// 导出单例实例
export const appUpdateManager = AppUpdateManager.getInstance();

// 便捷方法
export const checkForUpdates = () => appUpdateManager.autoCheckAndUpdate(true);
export const autoCheckUpdates = () => appUpdateManager.autoCheckAndUpdate(false);
