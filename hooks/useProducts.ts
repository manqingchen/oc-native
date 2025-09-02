import { useProductStore } from "@/stores/productStore";
import { getLocalizedContent } from "@/utils/data-helpers";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// 产品列表 Hook
export const useProductList = (params?: Product.ListParams) => {
  const {
    productList,
    isLoadingList,
    listError,
    hasMore,
    fetchProductList,
    clearProductList,
    clearErrors,
  } = useProductStore();

  const { i18n } = useTranslation();
  const language = i18n.language === 'en' ? 0 : 1;
  const [refreshing, setRefreshing] = useState(false);
  // 更新语言设置
  useEffect(() => {
    useProductStore.getState().setLanguage(language);
  }, [language]);

  // 获取产品列表
  const getProductList = useCallback(async (customParams?: Product.ListParams) => {
    await fetchProductList(customParams || params);
    setRefreshing(false);
  }, [fetchProductList, params]);

  // 刷新产品列表
  const refreshProductList = useCallback(async () => {
    setRefreshing(true)
    clearProductList();
    await getProductList();
  }, [getProductList, clearProductList]);

  return {
    productList,
    isLoading: isLoadingList,
    error: listError,
    hasMore,
    getProductList,
    refreshProductList,
    clearErrors,
    refreshing
  };
};

// 产品详情 Hook
export const useProductDetail = (productId?: string) => {
  const {
    productDetails = {},
    isLoadingDetail,
    detailError,
    fetchProductDetail,
    clearProductDetail,
    clearErrors,
  } = useProductStore();

  const productDetail = (productId && productDetails) ? productDetails[productId] : undefined;

  // 获取产品详情
  const getProductDetail = useCallback(async (
    params: Product.DetailParams,
  ) => {
    await fetchProductDetail(params);
  }, [fetchProductDetail]);

  // 清除特定产品详情
  const clearDetail = useCallback(() => {
    if (productId) {
      clearProductDetail(productId);
    }
  }, [productId, clearProductDetail]);

  return {
    productDetail,
    isLoading: isLoadingDetail,
    error: detailError,
    getProductDetail,
    clearDetail,
    clearErrors,
  };
};

// 产品页面逻辑 Hook - 包含所有页面相关的状态和逻辑
export const useProductPage = (params?: Product.ListParams) => {
  const [refreshing, setRefreshing] = useState(false);

  const {
    productList,
    isLoading,
    error,
    hasMore,
    getProductList,
    refreshProductList,
    clearErrors,
  } = useProductList(params);

  // 组件挂载时获取产品列表
  useEffect(() => {
    getProductList();
  }, [getProductList]);

  // 下拉刷新
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProductList();
    } finally {
      setRefreshing(false);
    }
  }, [refreshProductList]);

  // 加载更多
  const handleLoadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      await getProductList({
        limit: params?.limit || 20,
        cursor: productList.length,
      });
    }
  }, [hasMore, isLoading, getProductList, params?.limit, productList.length]);

  // 重试加载
  const handleRetry = useCallback(() => {
    clearErrors();
    getProductList();
  }, [clearErrors, getProductList]);

  // 计算状态
  const isInitialLoading = isLoading && productList.length === 0;
  const isLoadingMore = isLoading && productList.length > 0;
  const hasError = !!error;
  const isEmpty = productList.length === 0 && !isLoading;
  const showErrorState = hasError && productList.length === 0;

  return {
    // 数据
    productList,

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

// 根据当前language 获取产品中英文信息
export const useProductInfo = (productDetailList?: Product.IProductDetailList[]): Product.IProductDetailList => {
  const { i18n } = useTranslation();
  const language = i18n.language === 'en' ? 0 : 1;
  const productInfo = getLocalizedContent(productDetailList, language);
  return productInfo || {} as Product.IProductDetailList;
};