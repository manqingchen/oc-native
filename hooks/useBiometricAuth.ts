import { useState, useCallback, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';

// 生物识别支持类型
export interface BiometricSupport {
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
  securityLevel: LocalAuthentication.SecurityLevel;
}

// 生物识别认证结果
export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  warning?: string;
}

// 存储的凭证类型
export interface StoredCredentials {
  username?: string;
  token?: string;
  walletAddress?: string;
  timestamp: number;
}

// 生物识别设置
export interface BiometricSettings {
  enabled: boolean;
  lastUsed: number;
  authType: 'fingerprint' | 'face' | 'iris' | 'unknown';
}

const BIOMETRIC_STORAGE_KEY = 'biometric_enabled';
const CREDENTIALS_STORAGE_KEY = 'biometric_credentials';
const SETTINGS_STORAGE_KEY = 'biometric_settings';

export const useBiometricAuth = () => {
  const { t } = useTranslation();
  
  // 状态管理
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [supportedTypes, setSupportedTypes] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [securityLevel, setSecurityLevel] = useState<LocalAuthentication.SecurityLevel>(LocalAuthentication.SecurityLevel.NONE);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 检查生物识别支持情况
  const checkBiometricSupport = useCallback(async (): Promise<BiometricSupport> => {
    try {
      const [hasHardware, enrolled, types, level] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
        LocalAuthentication.getEnrolledLevelAsync(),
      ]);

      const support: BiometricSupport = {
        hasHardware,
        isEnrolled: enrolled,
        supportedTypes: types,
        securityLevel: level,
      };

      setIsSupported(hasHardware);
      setIsEnrolled(enrolled);
      setSupportedTypes(types);
      setSecurityLevel(level);

      return support;
    } catch (error) {
      console.error('检查生物识别支持失败:', error);
      return {
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
        securityLevel: LocalAuthentication.SecurityLevel.NONE,
      };
    }
  }, []);

  // 获取认证类型描述
  const getAuthTypeDescription = useCallback((types: LocalAuthentication.AuthenticationType[]): string => {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return t('biometric.faceId', 'Face ID');
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return t('biometric.touchId', 'Touch ID');
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return t('biometric.iris', 'Iris');
    }
    return t('biometric.biometric', 'Biometric');
  }, [t]);

  // 执行生物识别认证
  const authenticate = useCallback(async (
    promptMessage?: string,
    options?: Partial<LocalAuthentication.LocalAuthenticationOptions>
  ): Promise<BiometricAuthResult> => {
    setIsLoading(true);
    
    try {
      // 检查支持情况
      const support = await checkBiometricSupport();
      
      if (!support.hasHardware) {
        return {
          success: false,
          error: t('biometric.error.noHardware', 'Device does not support biometric authentication'),
        };
      }

      if (!support.isEnrolled) {
        return {
          success: false,
          error: t('biometric.error.notEnrolled', 'No biometric data enrolled on this device'),
        };
      }

      // 执行认证
      const authType = getAuthTypeDescription(support.supportedTypes);
      const defaultPrompt = t('biometric.prompt.authenticate', `Authenticate with ${authType}`);
      
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || defaultPrompt,
        cancelLabel: t('biometric.cancel', 'Cancel'),
        disableDeviceFallback: false,
        requireConfirmation: true,
        biometricsSecurityLevel: 'strong',
        ...options,
      });

      if (result.success) {
        // 更新最后使用时间
        await updateLastUsed();
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || t('biometric.error.authFailed', 'Authentication failed'),
          warning: result.warning,
        };
      }
    } catch (error: any) {
      console.error('生物识别认证失败:', error);
      return {
        success: false,
        error: error.message || t('biometric.error.unknown', 'Unknown error occurred'),
      };
    } finally {
      setIsLoading(false);
    }
  }, [checkBiometricSupport, getAuthTypeDescription, t]);

  // 启用生物识别认证
  const enableBiometric = useCallback(async (credentials: StoredCredentials): Promise<boolean> => {
    try {
      // 先进行认证确认
      const authResult = await authenticate(
        t('biometric.prompt.enable', 'Authenticate to enable biometric login')
      );
      
      if (!authResult.success) {
        return false;
      }

      // 存储凭证和设置
      const credentialsWithTimestamp = {
        ...credentials,
        timestamp: Date.now(),
      };

      const settings: BiometricSettings = {
        enabled: true,
        lastUsed: Date.now(),
        authType: getAuthType(supportedTypes),
      };

      await Promise.all([
        SecureStore.setItemAsync(BIOMETRIC_STORAGE_KEY, 'true'),
        SecureStore.setItemAsync(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentialsWithTimestamp)),
        SecureStore.setItemAsync(SETTINGS_STORAGE_KEY, JSON.stringify(settings)),
      ]);

      setIsEnabled(true);
      return true;
    } catch (error) {
      console.error('启用生物识别失败:', error);
      return false;
    }
  }, [authenticate, supportedTypes, t]);

  // 禁用生物识别认证
  const disableBiometric = useCallback(async (): Promise<boolean> => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(BIOMETRIC_STORAGE_KEY),
        SecureStore.deleteItemAsync(CREDENTIALS_STORAGE_KEY),
        SecureStore.deleteItemAsync(SETTINGS_STORAGE_KEY),
      ]);

      setIsEnabled(false);
      return true;
    } catch (error) {
      console.error('禁用生物识别失败:', error);
      return false;
    }
  }, []);

  // 获取存储的凭证
  const getStoredCredentials = useCallback(async (): Promise<StoredCredentials | null> => {
    try {
      const authResult = await authenticate(
        t('biometric.prompt.getCredentials', 'Authenticate to access stored credentials')
      );
      
      if (!authResult.success) {
        return null;
      }

      const credentialsStr = await SecureStore.getItemAsync(CREDENTIALS_STORAGE_KEY);
      if (!credentialsStr) {
        return null;
      }

      return JSON.parse(credentialsStr) as StoredCredentials;
    } catch (error) {
      console.error('获取存储凭证失败:', error);
      return null;
    }
  }, [authenticate, t]);

  // 更新最后使用时间
  const updateLastUsed = useCallback(async (): Promise<void> => {
    try {
      const settingsStr = await SecureStore.getItemAsync(SETTINGS_STORAGE_KEY);
      if (settingsStr) {
        const settings: BiometricSettings = JSON.parse(settingsStr);
        settings.lastUsed = Date.now();
        await SecureStore.setItemAsync(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      }
    } catch (error) {
      console.error('更新最后使用时间失败:', error);
    }
  }, []);

  // 获取认证类型
  const getAuthType = (types: LocalAuthentication.AuthenticationType[]): BiometricSettings['authType'] => {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'face';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'fingerprint';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'iris';
    }
    return 'unknown';
  };

  // 检查是否已启用生物识别
  const checkBiometricEnabled = useCallback(async (): Promise<boolean> => {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_STORAGE_KEY);
      const isEnabledValue = enabled === 'true';
      setIsEnabled(isEnabledValue);
      return isEnabledValue;
    } catch (error) {
      console.error('检查生物识别启用状态失败:', error);
      return false;
    }
  }, []);

  // 初始化检查
  useEffect(() => {
    const initialize = async () => {
      await checkBiometricSupport();
      await checkBiometricEnabled();
    };
    
    initialize();
  }, [checkBiometricSupport, checkBiometricEnabled]);

  return {
    // 状态
    isSupported,
    isEnrolled,
    isEnabled,
    supportedTypes,
    securityLevel,
    isLoading,
    
    // 方法
    checkBiometricSupport,
    authenticate,
    enableBiometric,
    disableBiometric,
    getStoredCredentials,
    checkBiometricEnabled,
    getAuthTypeDescription,
  };
};
