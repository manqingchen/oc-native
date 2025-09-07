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
          <ProductTrendChart data={formatProductChartLine([
  {
    "id": 342,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-09-07",
    "nav": 10.73774,
    "dgNav": 10.7528,
    "hyNav": 10.73774,
    "okNav": 0,
    "okUpdateTime": null
  },
  {
    "id": 340,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-09-06",
    "nav": 10.73774,
    "dgNav": 10.7528,
    "hyNav": 10.73774,
    "okNav": 10.73774,
    "okUpdateTime": "2025-09-06 12:55:55"
  },
  {
    "id": 338,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-09-05",
    "nav": 10.73774,
    "dgNav": 10.7528,
    "hyNav": 10.73774,
    "okNav": 10.73774,
    "okUpdateTime": "2025-09-05 13:49:43"
  },
  {
    "id": 336,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-09-04",
    "nav": 10.73661,
    "dgNav": 10.7516,
    "hyNav": 10.7366,
    "okNav": 10.73661,
    "okUpdateTime": "2025-09-04 10:34:01"
  },
  {
    "id": 334,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-09-03",
    "nav": 10.73557,
    "dgNav": 10.7505,
    "hyNav": 10.73556,
    "okNav": 10.73557,
    "okUpdateTime": "2025-09-03 10:02:39"
  },
  {
    "id": 332,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-09-02",
    "nav": 10.73444,
    "dgNav": 10.7493,
    "hyNav": 10.73444,
    "okNav": 10.73444,
    "okUpdateTime": "2025-09-02 13:56:35"
  },
  {
    "id": 330,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-09-01",
    "nav": 10.73339,
    "dgNav": 10.7482,
    "hyNav": 10.73339,
    "okNav": 10.73339,
    "okUpdateTime": "2025-09-01 09:36:01"
  },
  {
    "id": 328,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-31",
    "nav": 10.73017,
    "dgNav": 10.7448,
    "hyNav": 10.73017,
    "okNav": 10.73017,
    "okUpdateTime": "2025-08-31 14:35:00"
  },
  {
    "id": 326,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-30",
    "nav": 10.73059,
    "dgNav": 10.7448,
    "hyNav": 10.73059,
    "okNav": 10.73059,
    "okUpdateTime": "2025-08-30 15:01:32"
  },
  {
    "id": 324,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-29",
    "nav": 10.73017,
    "dgNav": 10.7448,
    "hyNav": 10.73017,
    "okNav": 10.73059,
    "okUpdateTime": "2025-08-30 14:33:56"
  },
  {
    "id": 322,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-28",
    "nav": 10.7294,
    "dgNav": 10.7436,
    "hyNav": 10.7294,
    "okNav": 10.7294,
    "okUpdateTime": "2025-08-28 15:00:56"
  },
  {
    "id": 320,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-27",
    "nav": 10.7281,
    "dgNav": 10.7424,
    "hyNav": 10.7281,
    "okNav": 10.7281,
    "okUpdateTime": "2025-08-27 08:28:10"
  },
  {
    "id": 318,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-26",
    "nav": 10.72692,
    "dgNav": 10.7412,
    "hyNav": 10.72692,
    "okNav": 10.72692,
    "okUpdateTime": "2025-08-26 07:01:46"
  },
  {
    "id": 316,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-25",
    "nav": 10.72583,
    "dgNav": 10.7401,
    "hyNav": 10.72583,
    "okNav": 10.72583,
    "okUpdateTime": "2025-08-25 13:40:04"
  },
  {
    "id": 314,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-24",
    "nav": 10.72177,
    "dgNav": 10.7366,
    "hyNav": 10.72177,
    "okNav": 10.72177,
    "okUpdateTime": "2025-08-24 09:41:41"
  },
  {
    "id": 312,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-23",
    "nav": 10.72177,
    "dgNav": 10.7366,
    "hyNav": 10.72177,
    "okNav": 10.72177,
    "okUpdateTime": "2025-08-23 14:51:32"
  },
  {
    "id": 310,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-22",
    "nav": 10.72177,
    "dgNav": 10.7366,
    "hyNav": 10.72177,
    "okNav": 10.72177,
    "okUpdateTime": "2025-08-22 13:30:12"
  },
  {
    "id": 308,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-21",
    "nav": 10.72069,
    "dgNav": 10.7355,
    "hyNav": 10.72069,
    "okNav": 10.72069,
    "okUpdateTime": "2025-08-22 05:10:44"
  },
  {
    "id": 306,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-20",
    "nav": 10.71995,
    "dgNav": 10.7344,
    "hyNav": 0,
    "okNav": 0,
    "okUpdateTime": null
  },
  {
    "id": 304,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-19",
    "nav": 10.71995,
    "dgNav": 10.7332,
    "hyNav": 0,
    "okNav": 10.71995,
    "okUpdateTime": "2025-08-19 10:16:17"
  },
  {
    "id": 302,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-18",
    "nav": 10.7188,
    "dgNav": 10.732,
    "hyNav": 0,
    "okNav": 0,
    "okUpdateTime": null
  },
  {
    "id": 300,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-17",
    "nav": 10.7274,
    "dgNav": 10.7285,
    "hyNav": 0,
    "okNav": 0,
    "okUpdateTime": null
  },
  {
    "id": 298,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-16",
    "nav": 10.7273,
    "dgNav": 10.7285,
    "hyNav": 0,
    "okNav": 0,
    "okUpdateTime": null
  },
  {
    "id": 296,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-15",
    "nav": 10.7273,
    "dgNav": 10.7285,
    "hyNav": 0,
    "okNav": 10.7273,
    "okUpdateTime": "2025-08-15 09:42:10"
  },
  {
    "id": 295,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-14",
    "nav": 10.7273,
    "dgNav": 10.7273,
    "hyNav": 0,
    "okNav": 10.7273,
    "okUpdateTime": "2025-08-14 18:00:11"
  },
  {
    "id": 287,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-13",
    "nav": 10.7024,
    "dgNav": 10.7262,
    "hyNav": 0,
    "okNav": 10.7024,
    "okUpdateTime": "2025-08-13 11:30:49"
  },
  {
    "id": 280,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-12",
    "nav": 10.7024,
    "dgNav": 10.7251,
    "hyNav": 0,
    "okNav": 10.7024,
    "okUpdateTime": "2025-08-12 04:58:29"
  },
  {
    "id": 277,
    "productId": 105,
    "productToken": "OC-CMBMINT",
    "navDay": "2025-08-11",
    "nav": 10.7024,
    "dgNav": 10.7239,
    "hyNav": 0,
    "okNav": 10.7024,
    "okUpdateTime": "2025-08-12 04:57:51"
  }
] || [])} />
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
