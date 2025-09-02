import { ProductService } from "@/services/product.service";
import { create } from "zustand";

// 产品 Store 状态类型
interface ProductState {
  // 产品列表相关
  productList: Product.ProductList[];
  isLoadingList: boolean;
  listError: string | null;
  hasMore: boolean;
  
  // 产品详情相关
  productDetails: Record<string, Product.Detail>;
  isLoadingDetail: boolean;
  detailError: string | null;
  
  // 当前语言
  currentLanguage: number;
}

// 产品 Store Actions
interface ProductActions {
  // 产品列表操作
  fetchProductList: (params?: Product.ListParams) => Promise<void>;
  clearProductList: () => void;
  
  // 产品详情操作
  fetchProductDetail: (params: Product.DetailParams) => Promise<void>;
  clearProductDetail: (productId: string) => void;
  
  // 语言设置
  setLanguage: (language: number) => void;
  
  // 错误处理
  clearErrors: () => void;
}

// 产品 Store
export const useProductStore = create<ProductState & ProductActions>((set, get) => ({
  // 初始状态
  productList: [],
  isLoadingList: false,
  listError: null,
  hasMore: true,
  
  productDetails: {},
  isLoadingDetail: false,
  detailError: null,
  
  currentLanguage: 1, // 默认中文
  
  // Actions
  fetchProductList: async (params) => {
    set({ isLoadingList: true, listError: null });
    
    try {
      const response = await ProductService.getList({
        ...params,
        language: get().currentLanguage,
      });
      
      if (response.success && response.data) {
        set({
          productList: response.data.productList,
          hasMore: response.data.hasMore,
          isLoadingList: false,
        });
      } else {
        set({
          listError: response.message || '获取产品列表失败',
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
  
  clearProductList: () => {
    set({
      productList: [],
      hasMore: true,
      listError: null,
    });
  },
  
  fetchProductDetail: async (params) => {
    const productId = params.id;
    set({ isLoadingDetail: true, detailError: null, productDetails: null });
    
    try {

      const response = await ProductService.getDetail(params);
      
      if (response.success && response.data) {
        set(state => ({
          productDetails: {
            ...state.productDetails,
            [productId]: response.data,
          },
          isLoadingDetail: false,
        }));
      } else {
        set({
          detailError: response.message || '获取产品详情失败',
          isLoadingDetail: false,
        });
      }
    } catch (error) {
      set({
        detailError: error instanceof Error ? error.message : '网络错误',
        isLoadingDetail: false,
      });
    }
  },
  
  clearProductDetail: (productId) => {
    set(state => {
      const newDetails = { ...state.productDetails };
      delete newDetails[productId];
      return { productDetails: newDetails };
    });
  },
  
  setLanguage: (language) => {
    set({ currentLanguage: language });
  },
  
  clearErrors: () => {
    set({ listError: null, detailError: null });
  },
}));
