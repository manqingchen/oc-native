import React from 'react';
import { Button, ButtonText, Box, Text } from '@/components/ui';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { UpdateStatus } from '@/utils/appUpdate';
import { useTranslation } from 'react-i18next';

export const UpdateChecker: React.FC = () => {
  const { updateStatus, isChecking, checkForUpdates, getVersionInfo } = useAppUpdate();
  const versionInfo = getVersionInfo();

  const getStatusText = () => {
    switch (updateStatus) {
      case UpdateStatus.CHECKING:
        return '正在检查更新...';
      case UpdateStatus.AVAILABLE:
        return '发现新版本';
      case UpdateStatus.DOWNLOADING:
        return '正在下载更新...';
      case UpdateStatus.READY:
        return '更新已准备就绪';
      case UpdateStatus.NOT_AVAILABLE:
        return '当前已是最新版本';
      case UpdateStatus.ERROR:
        return '检查更新失败';
      default:
        return '未知状态';
    }
  };

  const getStatusColor = () => {
    switch (updateStatus) {
      case UpdateStatus.AVAILABLE:
        return 'text-orange-500';
      case UpdateStatus.READY:
        return 'text-green-500';
      case UpdateStatus.ERROR:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Box className="p-4 bg-white rounded-lg shadow-sm">
      <Text className="text-lg font-semibold mb-2">应用更新</Text>
      
      {/* 版本信息 */}
      <Box className="mb-4">
        <Text className="text-sm text-gray-600">
          当前版本: {versionInfo.updateId || '开发版本'}
        </Text>
        {versionInfo.createdAt && (
          <Text className="text-sm text-gray-600">
            更新时间: {new Date(versionInfo.createdAt).toLocaleDateString()}
          </Text>
        )}
      </Box>

      {/* 更新状态 */}
      <Box className="mb-4">
        <Text className={`text-sm ${getStatusColor()}`}>
          {getStatusText()}
        </Text>
      </Box>

      {/* 检查更新按钮 */}
      <Button
        onPress={checkForUpdates}
        disabled={isChecking || updateStatus === UpdateStatus.DOWNLOADING}
        className={`${
          isChecking || updateStatus === UpdateStatus.DOWNLOADING
            ? 'bg-gray-300'
            : 'bg-blue-500'
        }`}
      >
        <ButtonText className="text-white">
          {isChecking ? '检查中...' : '检查更新'}
        </ButtonText>
      </Button>
    </Box>
  );
};
