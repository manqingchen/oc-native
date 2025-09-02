import React from "react";
import { Box, Button, ButtonText, Image, Pressable, Text } from "@/components/ui";

import { ModalType } from "@/constants/modal";
import { useModal } from "@/hooks/modal.hook";
import { useProductComments } from "@/hooks/product.comments";
import { useProductInfo } from "@/hooks/product.hook";
import { formatAmount, formatNav, formatUsername } from "@/utils";
import { formatTVLNumber } from "@/utils/format";
import { useTranslation } from "react-i18next";
import { formatProductChartLine } from "@/utils/chart.utils";
import { useAssets } from "@/hooks/useAsset";
import { ProductTrendChart } from "@/components/chart/product.echarts";
import { router } from "expo-router";

export const ProductDetailMobileInfo = React.forwardRef<any, { product: Product.Detail }>(
  ({ product }, ref) => {
    const { productDetailShare } = useAssets();
    const { t } = useTranslation();
    const { open } = useModal()
    const productInfo = useProductInfo(product.productDetailList)
    const { hasComment, currentComment } = useProductComments({ product })

    return (
      <Box className=" w-full bg-white rounded-3xl">
        {/* title */}
        <Box className="flex flex-row items-center gap-2.5 relative">
          <Box className="w-[50px] h-[50px] rounded-[10px]" >
            <Image source={{
              uri: product.icon
            }} className="w-full h-full rounded-[10px] overflow-hidden" />

          </Box>
          <Box className="flex flex-col gap-1">
            <Text className="text-[25.6px] leading-[31px] font-bold text-[#1B1B1D] font-['inter']">
              {productInfo.name || product.productName}
            </Text>
            <Text className="text-[13px] leading-[24px] font-semibold text-[#1B1B1D] font-['inter']">
              {productInfo.subtitle}
            </Text>
          </Box>
          <Pressable
            className="absolute right-[23px] top-0 w-8 h-8 rounded-full"
            onPress={() => {
              open(ModalType.SHARE)
            }}
          >
            <Image source={productDetailShare} alt="share" className="w-full h-full" />
          </Pressable>
        </Box>
        {/* price and apy */}
        <Box className="flex flex-row mt-3 justify-between">
          <Box className="flex flex-col flex-1">
            <Text className="text-[16px] leading-[19px] font-semibold text-black font-['inter']">
              {t('assets.price')}
            </Text>
            <Text className="text-[25.863px] leading-[31px] font-extrabold text-black font-['inter']">
              ${formatNav(product.nav)}
            </Text>
          </Box>
          <Box className="flex flex-col flex-1">
            <Text className="text-[16px] leading-[19px] font-semibold text-black font-['inter']">
              {t('product.apy')}
            </Text>
            <Text className="text-[25.863px] leading-[31px] font-extrabold text-black font-['inter']">
              {formatAmount(product.apy)}%
            </Text>
          </Box>
        </Box>
        {/* underlying and tvl */}
        <Box className="flex flex-row mt-3 justify-between">
          <Box className="flex flex-col flex-1 gap-2">
            <Text className="text-[10px] leading-[12px] font-normal text-[#8F8F8F] font-['inter']">
              {t('product.underlying_assert')}: {productInfo.issuer}
            </Text>

            <Text className="text-[10px] leading-[12px] font-normal text-[#8F8F8F] font-['inter']">
              {productInfo.assetType}
            </Text>

          </Box>
          <Box className="flex flex-col flex-1 gap-2">
            {product.tvl ? <Text className="text-[10px] leading-[12px] font-normal text-[#8F8F8F] font-['inter'] text-right">
              {t('product.tvl')}: {formatTVLNumber(product.tvl)}
            </Text> : null}
            <Text className="text-[10px] leading-[12px] font-normal text-[#8F8F8F] font-['inter'] text-right">
              {t("assets.onchain_point")}: {product.pointsConfig}{t('product.x')}
            </Text>
          </Box>
        </Box>
        {/* echart */}
        <Box className="h-[180px] mt-[17px]">
          {/* <ProductTrendChart data={formatProductChartLine(product.navList || [])} /> */}
        </Box>
        {/* user say */}
        {hasComment && (
          <Box className="relative mt-[9px] h-[41px] bg-[#F2F2F2] rounded-[21px] py-2 px-3 flex flex-row items-center gap-2">
            <Box className="h-2.5 pl-[3px] pr-2 bg-black absolute -top-[1px] left-1 flex items-center justify-center" style={{
              borderRadius: 20,
              borderBottomLeftRadius: 0
            }}>
              <Text className="font-['Urbanist'] not-italic font-normal text-[8px] leading-[12px] flex items-center text-white">
                {t('product.detail.the_user_said')}
              </Text>
            </Box>
            <Image className="w-[20px] h-[20px] rounded-full shrink-0" source={{
              uri: currentComment?.profilePicture
            }} />
            <Text className="text-[10px] leading-[15px] font-bold text-black font-['inter'] flex items-center">
              {formatUsername(currentComment?.nickname)}
            </Text>
            <Text
              // @ts-ignore
              style={{
                width: 280,
                fontFamily: 'Urbanist',
                fontSize: 8,
                lineHeight: 1.5,
                color: 'black',
                opacity: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
              }} className="ml-[21px] font-['Urbanist'] font-normal text-[8px] leading-[12px] flex items-center text-black line-clamp-2">
              {currentComment?.comment}
            </Text>
          </Box>
        )}
        <Button
          className="h-11 mt-2"
          ref={ref}
          onPress={() => {
            router.push(`/trade?id=${product.productId}`);
          }}
        >
          <ButtonText>{t("button.subscribe")}</ButtonText>
        </Button>
      </Box>
    );
  }
);

ProductDetailMobileInfo.displayName = 'ProductDetailMobileInfo';
