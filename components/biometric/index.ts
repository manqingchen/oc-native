// 生物识别认证组件导出文件

// Hooks
export { useBiometricAuth } from '@/hooks/useBiometricAuth';
export { useBiometricLogin } from '@/hooks/useBiometricLogin';

// Components
export { BiometricAuthButton, BiometricStatusIndicator } from './BiometricAuthButton';
export { BiometricGuard } from './BiometricGuard';
export { BiometricAppSettings } from './BiometricAppSettings';

// Types
export type {
  BiometricSupport,
  BiometricAuthResult,
  StoredCredentials,
  BiometricSettings as BiometricSettingsType,
} from '@/hooks/useBiometricAuth';

export type {
  BiometricLoginState,
  BiometricLoginResult,
} from '@/hooks/useBiometricLogin';
