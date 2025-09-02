import Toast from 'react-native-root-toast';

// Toast 样式配置
export const toastConfig = {
  // 基础配置
  base: {
    duration: Toast.durations.SHORT,
    position: Toast.positions.TOP,
    shadow: true,
    animation: true,
    hideOnPress: true,
    opacity: 0.9,
  },
  
  // 成功提示样式
  success: {
    // backgroundColor: '#4CAF50',
    textColor: '#ffffff',
  },
  
  // 错误提示样式
  error: {
    backgroundColor: '#F44336',
    textColor: '#ffffff',
    duration: Toast.durations.LONG,
  },
  
  // 警告提示样式
  warning: {
    backgroundColor: '#FF9800',
    textColor: '#ffffff',
    duration: Toast.durations.LONG,
  },
  
  // 信息提示样式
  info: {
    backgroundColor: '#2196F3',
    textColor: '#ffffff',
  },
};

// Toast 工具函数
export const showToast = {
  success: (message: string, customConfig?: any) => {
    return Toast.show(message, {
      ...toastConfig.base,
      ...toastConfig.success,
      ...customConfig,
    });
  },
  
  error: (message: string, customConfig?: any) => {
    return Toast.show(message, {
      ...toastConfig.base,
      ...toastConfig.error,
      ...customConfig,
    });
  },
  
  warning: (message: string, customConfig?: any) => {
    return Toast.show(message, {
      ...toastConfig.base,
      ...toastConfig.warning,
      ...customConfig,
    });
  },
  
  info: (message: string, customConfig?: any) => {
    return Toast.show(message, {
      ...toastConfig.base,
      ...toastConfig.info,
      ...customConfig,
    });
  },
  
  // 自定义 Toast
  custom: (message: string, config: any) => {
    return Toast.show(message, {
      ...toastConfig.base,
      ...config,
    });
  },
};

// 隐藏 Toast
export const hideToast = (toast: any) => {
  Toast.hide(toast);
};

// 预设位置常量
export const toastPositions = {
  TOP: Toast.positions.TOP,
  CENTER: Toast.positions.CENTER,
  BOTTOM: Toast.positions.BOTTOM,
};

// 预设持续时间常量
export const toastDurations = {
  SHORT: Toast.durations.SHORT,
  LONG: Toast.durations.LONG,
};
