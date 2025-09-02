import { Footer } from "@/components/footer";
import { MobileCommonBar } from "@/components/nav/mobile.common.bar";
import { Box } from "@/components/ui";
import { useProductDetail } from "@/hooks/useProducts";

import { twClassnames } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native";
import { useMyAssetsStore } from "@/stores/my.assets.store";
import { ProductDetailDescription } from "@/components/productDetail/description";
import { ProductDetailMobileInfo } from "@/components/productDetail/info";

export default function ProductDetail() {
  const params = useLocalSearchParams();
  const { id } = (params || {}) as { id: string };

  const dwm = useMyAssetsStore(s => s.dwm)
  const { productDetail, getProductDetail } = useProductDetail(id as string);

  useEffect(() => {
    if (id) {
      getProductDetail({
        id,
        dwm
      })
    }
  }, [id, dwm])
  
  if (!productDetail) return null
  
  return (
    <Box className="h-full bg-white">
      <MobileCommonBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 h-full px-5"
      >
        <ProductDetailMobileInfo product={productDetail || {} as Product.Detail} />
        <ProductDetailDescription product={(productDetail || {}) as Product.Detail} />
        <Footer />
      </ScrollView>
    </Box>
  );
}
