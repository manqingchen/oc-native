import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BiometricStoreState {
  // 应用级别的生物识别设置
  isAppLockEnabled: boolean;           // 是否启用应用锁定
  requireAuthOnLaunch: boolean;        // 启动时是否需要认证
  requireAuthOnBackground: boolean;    // 从后台返回时是否需要认证
  authTimeoutMinutes: number;          // 认证超时时间（分钟）
  lastAuthTime: number;                // 最后一次认证时间
  
  // 设置方法
  setAppLockEnabled: (enabled: boolean) => void;
  setRequireAuthOnLaunch: (required: boolean) => void;
  setRequireAuthOnBackground: (required: boolean) => void;
  setAuthTimeout: (minutes: number) => void;
  updateLastAuthTime: () => void;
  
  // 检查方法
  isAuthRequired: () => boolean;
  isAuthExpired: () => boolean;
  
  // 重置方法
  resetSettings: () => void;
}

const DEFAULT_AUTH_TIMEOUT = 5; // 5分钟

export const useBiometricStore = create<BiometricStoreState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAppLockEnabled: false,
      requireAuthOnLaunch: true,
      requireAuthOnBackground: true,
      authTimeoutMinutes: DEFAULT_AUTH_TIMEOUT,
      lastAuthTime: 0,

      // 设置方法
      setAppLockEnabled: (enabled: boolean) => {
        set({ isAppLockEnabled: enabled });
        if (enabled) {
          // 启用应用锁时，强制每次进入/回前台都需认证
          set({
            requireAuthOnLaunch: true,
            requireAuthOnBackground: true,
            lastAuthTime: 0, // 视为未认证，确保启用后首次立即校验
          });
        } else {
          // 禁用应用锁定时，关闭相关拦截
          set({
            requireAuthOnLaunch: false,
            requireAuthOnBackground: false,
          });
        }
      },

      setRequireAuthOnLaunch: (required: boolean) => {
        set({ requireAuthOnLaunch: required });
      },

      setRequireAuthOnBackground: (required: boolean) => {
        set({ requireAuthOnBackground: required });
      },

      setAuthTimeout: (minutes: number) => {
        set({ authTimeoutMinutes: Math.max(1, Math.min(60, minutes)) }); // 限制在1-60分钟
      },

      updateLastAuthTime: () => {
        set({ lastAuthTime: Date.now() });
      },

      // 检查方法
      isAuthRequired: () => {
        const state = get();
        if (!state.isAppLockEnabled) {
          return false;
        }

        // 首次启动（lastAuthTime === 0）必须认证
        if (state.lastAuthTime === 0) {
          return true;
        }

        // 如果启用了后台返回认证，任何一次回到前台都需要重新认证
        if (state.requireAuthOnBackground && state.lastAuthTime > 0) {
          return true;
        }

        return false;
      },

      isAuthExpired: () => {
        const state = get();
        if (!state.isAppLockEnabled || state.lastAuthTime === 0) {
          return state.requireAuthOnLaunch; // 如果是首次启动且需要启动认证，则认为已过期
        }

        // 每次回到前台都视为过期，需重新认证
        if (state.requireAuthOnBackground) {
          return true;
        }
        return false;
      },

      // 重置方法
      resetSettings: () => {
        set({
          isAppLockEnabled: false,
          requireAuthOnLaunch: true,
          requireAuthOnBackground: true,
          authTimeoutMinutes: DEFAULT_AUTH_TIMEOUT,
          lastAuthTime: 0,
        });
      },
    }),
    {
      name: 'biometric-store',
      storage: createJSONStorage(() => AsyncStorage),
      // 只持久化设置，不持久化认证时间
      partialize: (state) => ({
        isAppLockEnabled: state.isAppLockEnabled,
        requireAuthOnLaunch: state.requireAuthOnLaunch,
        requireAuthOnBackground: state.requireAuthOnBackground,
        authTimeoutMinutes: state.authTimeoutMinutes,
      }),
    }
  )
);

// 便捷的 Hook 用于获取常用状态
export const useBiometricAppLock = () => {
  const store = useBiometricStore();
  
  return {
    isEnabled: store.isAppLockEnabled,
    isAuthRequired: store.isAuthRequired(),
    isAuthExpired: store.isAuthExpired(),
    updateAuthTime: store.updateLastAuthTime,
    settings: {
      requireOnLaunch: store.requireAuthOnLaunch,
      requireOnBackground: store.requireAuthOnBackground,
      timeoutMinutes: store.authTimeoutMinutes,
    },
  };
};
