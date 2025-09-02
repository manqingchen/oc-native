import { useState, useEffect, useCallback } from 'react';
import { appUpdateManager, UpdateStatus, UpdateType } from '@/utils/appUpdate';

export const useAppUpdate = () => {
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>(UpdateStatus.NOT_AVAILABLE);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 检查更新
  const checkForUpdates = useCallback(async (showToast: boolean = true) => {
    setIsChecking(true);
    try {
      await appUpdateManager.autoCheckAndUpdate(showToast);
      setUpdateStatus(appUpdateManager.getUpdateStatus());
    } finally {
      setIsChecking(false);
    }
  }, []);

  // 手动触发更新检查
  const manualCheckUpdates = useCallback(() => {
    checkForUpdates(true);
  }, [checkForUpdates]);

  // 应用启动时自动检查
  const autoCheckOnLaunch = useCallback(() => {
    checkForUpdates(false);
  }, [checkForUpdates]);

  // 获取版本信息
  const getVersionInfo = useCallback(() => {
    return appUpdateManager.getCurrentVersionInfo();
  }, []);

  useEffect(() => {
    // 监听更新状态变化
    const status = appUpdateManager.getUpdateStatus();
    setUpdateStatus(status);
    setIsDownloading(status === UpdateStatus.DOWNLOADING);
  }, []);

  return {
    updateStatus,
    isChecking,
    isDownloading,
    checkForUpdates: manualCheckUpdates,
    autoCheckOnLaunch,
    getVersionInfo,
  };
};
