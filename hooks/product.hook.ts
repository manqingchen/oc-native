import { useUserStore } from "@/api/request";
import { getLocalizedContent } from "@/utils/data-helpers";


// 根据当前language 获取产品中英文信息
export const useProductInfo = (productDetailList?: Product.IProductDetailList[]): Product.IProductDetailList => {
  const language = useUserStore(state => state.language);
  
  const productInfo = getLocalizedContent(productDetailList, language);
  return productInfo || {} as Product.IProductDetailList;
}