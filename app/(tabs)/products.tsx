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
  const render = () => {
    if (isLoading && productList.length === 0) {
    return (
      <Box className="items-center flex justify-center h-full">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-500">
          {t('common.loading')}
        </Text>
      </Box>
    )
    }
    if (productList.length > 0) {
      return (
        productList.map((product) => (
          <Box key={product.productId}>
            <ProductCard product={product} />
          </Box>
        ))
      )
    }
    return <Empty />
  }
  return (
    <Box className="h-full">
      <MobileHomeBar />
      <ScrollView
        className="flex-1 h-full"
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshProductList}
          />
        }
      >
        <Box className="flex justify-between flex-col h-full">
          <Box
            className={twClassnames(
              "mb-[100px]",
              "gap-[31px] p-5 pt-2",
              "flex-1 h-full"
            )}
          >
            {render()}
          </Box>
          <Footer />
        </Box>
      </ScrollView>
    </Box>
  );
}
