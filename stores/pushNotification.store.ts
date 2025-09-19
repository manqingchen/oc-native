import { create } from 'zustand';

export interface PushNotificationState {
  isInitialized: boolean;
  hasPermission: boolean;
  pushToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface PushNotificationStore extends PushNotificationState {
  // 局部更新（合并）
  update: (updates: Partial<PushNotificationState>) => void;
  // 重置为初始值
  reset: () => void;
}

const initialState: PushNotificationState = {
  isInitialized: false,
  hasPermission: false,
  pushToken: null,
  isLoading: false,
  error: null,
};

export const usePushNotificationStore = create<PushNotificationStore>((set) => ({
  ...initialState,
  update: (updates) => set((prev) => ({ ...prev, ...updates })),
  reset: () => set({ ...initialState }),
}));

