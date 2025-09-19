import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginStoreState {
  isLogin: boolean;

  setIsLogin: (isLogin: boolean) => void;
}

export const useLoginStore = create<LoginStoreState>()(
  persist(
    (set, get) => ({
      isLogin: false,
      setIsLogin: (isLogin: boolean) => set({ isLogin }),
    }),
    {
      name: 'login-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
