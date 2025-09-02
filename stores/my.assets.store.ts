import { Dwm } from "@/constants/my.assest";
import { MyAssetsService } from "@/services/my.assets.service";
import { create } from "zustand";

// MyAssets Store 状态类型
interface MyAssetsState {
  // 我的资产列表相关
  myAssetList: MyAssets.IUserAsset[];
  isLoadingList: boolean;
  listError: string | null;
  hasMore: boolean;

  // 我的资产信息相关
  myAssetsInfo: MyAssets.IMyAssets | null;
  isLoadingInfo: boolean;
  infoError: string | null;

  // 当前语言
  currentLanguage: number;

  // DWM 设置
  dwm: Dwm;
}

// MyAssets Store Actions
interface MyAssetsActions {
  // 我的资产列表操作
  fetchMyAssetList: (params?: MyAssets.IMyAssetsListParams) => Promise<void>;
  clearMyAssetList: () => void;

  // 我的资产信息操作
  fetchMyAssetsInfo: (params?: MyAssets.IMyAssetsParams) => Promise<void>;
  clearMyAssetsInfo: () => void;

  // 语言设置
  setLanguage: (language: number) => void;

  // DWM 设置
  setDwm: (dwm: Dwm) => void;

  // 错误处理
  clearErrors: () => void;
}

// MyAssets Store
export const useMyAssetsStore = create<MyAssetsState & MyAssetsActions>((set, get) => ({
  // 初始状态
  myAssetList: [],
  isLoadingList: false,
  listError: null,
  hasMore: true,

  myAssetsInfo: null,
  isLoadingInfo: false,
  infoError: null,

  currentLanguage: 1, // 默认中文
  dwm: Dwm.day,

  // Actions
  fetchMyAssetList: async (params) => {
    set({ isLoadingList: true, listError: null });

    try {
      const response = await MyAssetsService.getMyAsset({
        ...params,
        language: get().currentLanguage,
      });

      console.log('response ===================>>>>>>>>>>> ', response);
      if (response.success && response.data) {
        set({
          myAssetList: response.data.assetList,
          hasMore: response.data.hasMore,
          isLoadingList: false,
        });
      } else {
        set({
          listError: response.message || '获取我的资产列表失败',
          isLoadingList: false,
        });
      }
    } catch (error) {
      set({
        listError: error instanceof Error ? error.message : '网络错误',
        isLoadingList: false,
      });
    }
  },

  clearMyAssetList: () => {
    set({
      myAssetList: [],
      hasMore: true,
      listError: null,
    });
  },

  fetchMyAssetsInfo: async (params) => {
    set({ isLoadingInfo: true, infoError: null });

    try {
      const response = await MyAssetsService.getMyInfo({
        ...params,
        language: get().currentLanguage,
        dwm: get().dwm,
      });

      if (response.success && response.data) {
        set({
          myAssetsInfo: response.data,
          isLoadingInfo: false,
        });
      } else {
        set({
          infoError: response.message || '获取我的资产信息失败',
          isLoadingInfo: false,
        });
      }
    } catch (error) {
      set({
        infoError: error instanceof Error ? error.message : '网络错误',
        isLoadingInfo: false,
      });
    }
  },

  clearMyAssetsInfo: () => {
    set({
      myAssetsInfo: null,
      infoError: null,
    });
  },

  setLanguage: (language) => {
    set({ currentLanguage: language });
  },

  setDwm: (dwm) => {
    set({ dwm });
  },

  clearErrors: () => {
    set({ listError: null, infoError: null });
  },
}));
