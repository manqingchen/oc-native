import { useProductInfo } from "@/hooks/useProducts";
import { formatAmount, twClassnames } from "@/utils";
import { formatTVLNumber } from "@/utils/format";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Box, Button, ButtonText, Image, Text } from "../ui";
import { RichText } from "../richText/richText";

export function ProductCard({ product }: { product: Product.ProductList }) {
  const { t } = useTranslation();
  const productInfo = useProductInfo(product.productDetailList)
  return (
    <Link href={`/productDetail?id=${product.productId}`}>
      <Box
        className={twClassnames(
          "w-full bg-white rounded-3xl p-5 relative"
        )}
      >
        {/* {product?.badge && (
          <Image
            source={{
              uri: product.badge,
            }}
            alt="product-icon"
            className="absolute right-4 top-4 bg-black w-4 h-4 rounded-full"
          />
        )} */}
        <Box
          className={twClassnames(
            "flex flex-row items-center flex-1",
            "gap-2.5"
          )}
        >
          <Image
            source={{
              uri: product.icon,
            }}
            alt="product-icon"
            className="w-[57px] h-[57px] rounded-[10px]"
          />
          <Box className="flex flex-col gap-1  flex-1">
            <Text
              className={twClassnames(
                "text-[22.668px] leading-[27px] font-bold text-[#151517] font-['Inter']"
              )}
            >
              {product.productName}
            </Text>
            <Text
              className={twClassnames(
                "text-[12.0896px] leading-[18px] font-semibold text-[#151517] font-['Inter'] flex-wrap break-words"
              )}
              style={{
                flex: 1
              }}
            >
              {productInfo?.subtitle}
            </Text>
          </Box>
        </Box>

        <Box className="flex flex-row mt-5">
          <Box className="flex-1 flex flex-row gap-[58px]">
            <Box className="flex flex-col flex-1 gap-[14px]">
              <Text className="text-[10.62px] leading-[13px] font-semibold text-[#151517] font-['Inter']">
                <RichText html={`
                    <Text class="uai-home">${productInfo.uai}</Text>
                    `} className="uai" />
              </Text>
              <Text className="text-[10.62px] leading-[13px] font-semibold text-[#151517] font-['Inter']">
                {productInfo.assetType}
              </Text>
            </Box>
            <Box className="flex flex-col flex-1 gap-[14px]">
              <Text className="text-[10.62px] leading-[13px] font-semibold text-[#151517] font-['Inter']">
                {t('product.tvl')}: {formatTVLNumber(product.tvl)}
              </Text>
              <Text className="text-[10.62px] leading-[13px] font-semibold text-[#151517] font-['Inter']">
                {t('product.member_points')}: {product.pointsConfig}
              </Text>
            </Box>
          </Box>
        </Box>
        {/* {!isPC && product.showNavChart && <Box className="h-[70px] w-full mt-[37px] mb-[14px]" ref={ref as any}><ProductLineOnlyChart width={width} /></Box>} */}
        <Box className="flex flex-row justify-between items-end">
          <Box className={twClassnames("mb-4")}>
            <Text className="text-[16px] leading-[24px] font-semibold text-[#151517] font-['Inter']">
              APY{" "}
            </Text>
            <Text
              className={twClassnames(
                "text-[42px] leading-[51px] font-extrabold text-black font-['Inter']"
              )}
            >
              {formatAmount(product.apy)}%
            </Text>
          </Box>
        </Box>
        <Button
          className="h-11"
          onPress={(e) => {
          //   e.stopPropagation();
          //   e.preventDefault();
            router.push(`/trade?id=${product.productId}`)
          }}
        >
          <ButtonText>
             {t("button.subscribe")}
          </ButtonText>
        </Button>
      </Box>
    </Link>
  );
}
