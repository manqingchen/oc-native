import { Empty } from '@/components/empty';
import { Footer } from '@/components/footer';
import { MobileHomeBar } from '@/components/nav/mobile.home.bar';
import { ProductCard } from '@/components/product/product.card';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useProductList } from "@/hooks/useProducts";
import { twClassnames } from "@/utils";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";

export default function Products() {
  const { t } = useTranslation();
  
  const {
    isLoading,
    refreshing,
    productList,
    getProductList,
    refreshProductList,
  } = useProductList({ limit: 100 });

  useEffect(() => {
    getProductList();
  }, []);

  return (
    <Box className="h-full">
      <MobileHomeBar />
      <ScrollView
        className="flex-1 h-full"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshProductList}
          />
        }
      >
        <Box className="h-full">
          <Box className="!px-0 flex justify-between">
            <Box
              className={twClassnames(
                "mb-[100px] mt-5",
                "gap-[31px] p-5"
              )}
            >
              {/* 加载状态 */}
              {isLoading && productList.length === 0 && (
                <Box className="py-20 items-center">
                  <ActivityIndicator size="large" />
                  <Text className="mt-2 text-gray-500">
                    {t('common.loading', '加载中...')}
                  </Text>
                </Box>
              )}

              {/* 产品列表 */}
              {productList?.map((product) => (
                <Box key={product.productId}>
                  <ProductCard product={product} />
                </Box>
              ))}

              {/* 空状态 */}
              {productList.length === 0 && !isLoading && (
                <Empty />
              )}
            </Box>
            <Footer />
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
