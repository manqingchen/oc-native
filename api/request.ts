import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useEffect, useState } from "react";
import { create } from "zustand";

// 定义基础响应类型
export interface BaseResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// 定义API错误码
export enum API_Code {
  Success = 0,
  Need_Login = 1001,
  No_Login = 1002,
  // 其他错误码...
}

// 创建应用主Axios实例
export const appAxiosInstance: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  // 在实际环境中，这里应该使用环境变量
  baseURL: "https://test1.onchain.channel", //"https://test.onchain.channel/apiservice",
  timeout: 60000,
});

// 创建用户状态存储
interface UserState {
  token: string | null;
  setToken: (token: string | null) => void;
  language: number;
  setLanguage: (language: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  language: 0,
  setToken: (token) => set({ token }),
  setLanguage: (language) => set({ language }),
}));

// 创建应用状态存储
interface AppState {
  deviceId: string | null;
  language: number;
  setDeviceId: (deviceId: string) => void;
  setLanguage: (language: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  deviceId: null,
  language: 0,
  setDeviceId: (deviceId) => set({ deviceId }),
  setLanguage: (language) => set({ language }),
}));

// 从AsyncStorage加载token和publicKey
export const loadToken = async () => {
  try {
    const token = await AsyncStorage.getItem("user_token");
    const publicKey = await AsyncStorage.getItem("user_publicKey");

    if (token) {
      useUserStore.getState().setToken(token);
    }

    return {
      token,
      publicKey
    };
  } catch (error) {
    console.error("Failed to load token:", error);
    return {
      token: null,
      publicKey: null
    };
  }
};

// 保存token和publicKey到AsyncStorage
export const saveToken = async (token: string, publicKey?: string) => {
  try {
    await AsyncStorage.setItem("user_token", token);
    useUserStore.getState().setToken(token);

    if (publicKey) {
      await AsyncStorage.setItem("user_publicKey", publicKey);
    }
  } catch (error) {
    console.error("Failed to save token:", error);
  }
};

// 清除token和publicKey
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem("user_token");
    await AsyncStorage.removeItem("user_publicKey");
    useUserStore.getState().setToken("");

    // 同时清除钱包状态
    const { useWalletStore } = await import('@/stores/walletStore');
    useWalletStore.getState().clearWalletState();
  } catch (error) {
    console.error("Failed to clear token:", error);
  }
};

// 处理API错误
export const handleAPIError = (code: number, message?: string) => {
  switch (code) {
    case API_Code.Need_Login:
    case API_Code.No_Login:
      // clearToken();
      // 这里可以添加导航到登录页的逻辑
      break;
    default:
      // 可以使用toast或者其他提示方式
      // console.error(`API Error: ${code}, ${message}`);
      break;
  }
};

// 请求拦截器
appAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { deviceId, language } = useAppStore.getState();
    const { token } = useUserStore.getState();

    if (deviceId) {
      config.headers["Device-ID"] = deviceId;
    }

    config.headers["Accept-Language"] = language;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
appAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;

    if (code === API_Code.Success) {
      return response;
    }

    handleAPIError(code, msg);

    return response;
  },
  async (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 基础请求函数
export async function appRequest<T>(options: AxiosRequestConfig): Promise<T> {
  return appAxiosInstance(options).then((res: AxiosResponse<T>) => res.data);
}

// 创建请求Hook
export const createRequest = <TReq = any, TResp = any>(
  name: string,
  requestConfigCreator: (args: TReq) => AxiosRequestConfig
) => {
  return (args: TReq, lazy = false) => {
    const [loading, setLoading] = useState<boolean>(!lazy);
    const [data, setData] = useState<BaseResponse<TResp> | undefined>(
      undefined
    );
    const [error, setError] = useState<AxiosError | null>(null);

    const request = async () => {
      setLoading(true);
      setError(null);

      try {
        const config = requestConfigCreator(args);
        const response = await appAxiosInstance.request<BaseResponse<TResp>>(
          config
        );
        setData(response.data);

        if (response.data.code !== API_Code.Success) {
          handleAPIError(response.data.code, response.data.msg);
        }

        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        throw axiosError;
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (!lazy) {
        request();
      }
    }, [lazy]);

    return {
      data,
      loading,
      error,
      request,
      refresh: request,
    };
  };
};
