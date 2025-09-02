import { useMyAssetsStore } from "@/stores/my.assets.store";
import { MyAssetsService } from "@/services/my.assets.service";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// 我的资产列表 Hook
export const useMyAssetList = (params?: MyAssets.IMyAssetsListParams) => {
  const {
    myAssetList,
    isLoadingList,
    listError,
    hasMore,
    fetchMyAssetList,
    clearMyAssetList,
    clearErrors,
  } = useMyAssetsStore();

  const { i18n } = useTranslation();
  const language = i18n.language === 'en' ? 0 : 1;
  const [refreshing, setRefreshing] = useState(false);
  
  // 更新语言设置
  useEffect(() => {
    useMyAssetsStore.getState().setLanguage(language);
  }, [language]);

  // 获取我的资产列表
  const getMyAssetList = useCallback(async (customParams?: MyAssets.IMyAssetsListParams) => {
    await fetchMyAssetList(customParams || params);
    setRefreshing(false);
  }, [fetchMyAssetList, params]);

  // 刷新我的资产列表
  const refreshMyAssetList = useCallback(async () => {
    setRefreshing(true);
    clearMyAssetList();
    await getMyAssetList();
  }, [getMyAssetList, clearMyAssetList]);

  return {
    data: myAssetList,
    myAssetList,
    isLoading: isLoadingList,
    error: listError,
    hasMore,
    getMyAssetList,
    refreshMyAssetList,
    clearErrors,
    refreshing
  };
};

// 我的资产信息 Hook
export const useMyAssetsInfo = (params?: MyAssets.IMyAssetsParams) => {
  const {
    myAssetsInfo,
    isLoadingInfo,
    infoError,
    fetchMyAssetsInfo,
    clearMyAssetsInfo,
    clearErrors,
  } = useMyAssetsStore();

  const { i18n } = useTranslation();
  const language = i18n.language === 'en' ? 0 : 1;
  
  // 更新语言设置
  useEffect(() => {
    useMyAssetsStore.getState().setLanguage(language);
  }, [language]);

  // 获取我的资产信息
  const getMyAssetsInfo = useCallback(async (customParams?: MyAssets.IMyAssetsParams) => {
    await fetchMyAssetsInfo(customParams || params);
  }, [fetchMyAssetsInfo, params]);

  return {
    data: myAssetsInfo,
    myAssetsInfo,
    isLoading: isLoadingInfo,
    error: infoError,
    getMyAssetsInfo,
    clearMyAssetsInfo,
    clearErrors,
  };
};

// 我的资产页面逻辑 Hook - 包含所有页面相关的状态和逻辑
export const useMyassets = (params?: MyAssets.IMyAssetsListParams) => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    myAssetList,
    isLoading,
    error,
    hasMore,
    getMyAssetList,
    refreshMyAssetList,
    clearErrors,
  } = useMyAssetList(params);

  // 组件挂载时获取我的资产列表
  useEffect(() => {
    getMyAssetList();
  }, [getMyAssetList]);

  // 下拉刷新
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshMyAssetList();
    } finally {
      setRefreshing(false);
    }
  }, [refreshMyAssetList]);

  // 加载更多
  const handleLoadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await getMyAssetList({
        limit: params?.limit || 20,
        cursor: myAssetList.length,
      });
    }
  }, [hasMore, isLoading, getMyAssetList, params?.limit, myAssetList.length]);

  // 重试加载
  const handleRetry = useCallback(() => {
    clearErrors();
    getMyAssetList();
  }, [clearErrors, getMyAssetList]);

  // 计算状态
  const isInitialLoading = isLoading && myAssetList.length === 0;
  const isLoadingMore = isLoading && myAssetList.length > 0;
  const hasError = !!error;
  const isEmpty = myAssetList.length === 0 && !isLoading;
  const showErrorState = hasError && myAssetList.length === 0;

  return {
    // 数据
    myAssetList,

    // 状态
    isInitialLoading,
    isLoadingMore,
    hasError,
    isEmpty,
    showErrorState,
    refreshing,
    hasMore,
    error,

    // 操作
    handleRefresh,
    handleLoadMore,
    handleRetry,
  };
};

// 我的交易列表 Hook
export const useMyTransactionList = (params?: MyAssets.IMyAssetsListParams) => {
  const [transactionList, setTransactionList] = useState<MyAssets.IUserAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { i18n } = useTranslation();
  const language = i18n.language === 'en' ? 0 : 1;

  // 获取交易列表
  const getMyTransactionList = useCallback(async (customParams?: MyAssets.IMyAssetsListParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchParams = {
        ...customParams || params,
      }
      console.log('fetchParams ===================>>>>>>>>>>> ', fetchParams);
      const response = await MyAssetsService.getMyTransactionList(fetchParams);

      console.log('response ===================>>>>>>>>>>> ', JSON.stringify(response));
      if (response.success && response.data) {
        setTransactionList(response.data.assetList || []);
        setHasMore(response.data.hasMore);
      } else {
        setError(response.message || '获取交易列表失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [params, language]);

  // 刷新交易列表
  const refreshMyTransactionList = useCallback(async () => {
    setRefreshing(true);
    setTransactionList([]);
    await getMyTransactionList();
  }, [getMyTransactionList]);

  // 清除错误
  const clearErrors = useCallback(() => {
    setError(null);
  }, []);

  return {
    data: {
      success: true,
      data: {
        assetList: transactionList,
        hasMore,
        cursor: ''
      },
      message: '',
      code: 0,
      trace_id: ''
    } as MyAssets.IMyAssetListResponse,
    transactionList,
    isLoading,
    error,
    hasMore,
    getMyTransactionList,
    refreshMyTransactionList,
    clearErrors,
    refreshing
  };
};

export const useReadNotice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const readNotice = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await MyAssetsService.readNotice();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '标记已读失败';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    readNotice,
    isLoading,
    error,
  };
};


// delete notice
export const useDeleteNotice = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNotice = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await MyAssetsService.deleteNotice(id);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除消息失败';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteNotice,
    isLoading,
    error,
  };
};
