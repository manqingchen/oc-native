import { Box, Button, ButtonText, Image, Pressable, Text } from "@/components/ui";
import { DrawerType } from "@/constants/drawer";
import { ModalType } from "@/constants/modal";
import { useModal } from "@/hooks/modal.hook";
import { useProductComments } from "@/hooks/product.comments";
import { useProductInfo } from "@/hooks/product.hook";
import { formatAmount, formatNav, formatUsername, twClassnames } from "@/utils";
import { formatTVLNumber } from "@/utils/format";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AssetsDateSelector } from "./assets.date.selector";
import { formatProductChartLine } from "@/utils/chart.utils";
import { ProductTrendChart } from "../chart/product.echarts";
import { RichText } from "../richText/richText";
import { useAssets } from "@/hooks/useAsset";
import Link from "expo-router/link";
export function ProductDetailDescription({ product }: { product: Product.Detail }) {
  const { t } = useTranslation();
  const { productDetailShare } = useAssets();
  const { open } = useModal();
  // const { openDrawer } = useDrawerStore()
  const [showUai, setShowUai] = useState(true)
  const { hasComment, currentComment } = useProductComments({ product: product })
  const productInfo = useProductInfo(product.productDetailList)
  return (
    <Box className="flex-1 bg-white">
      <Box
        className={twClassnames(
"flex flex-col gap-5 mt-2"
        )}
      >
        <Overview product={product} productInfo={productInfo} />
        <Activities product={product} />
      </Box>

      {productInfo.detailContent && <Box className={twClassnames("mt-5")}>
        <Title
          title={t("product.detail.summary")}
          className={"mt-5"}
        />
        <Box>
          <Content>
            <RichText html={productInfo.detailContent} />
          </Content>
        </Box>
      </Box>
      }

      {
        productInfo.publisherContent && <Box className={twClassnames("mt-5")}>
          <Title
            title={t("product.detail.about_lssuer")}
          />
          <Box>

            <Content>
              <RichText html={productInfo.publisherContent} />
            </Content>
          </Box>
        </Box>
      }
      {
        productInfo.protocolContent && <Box className={twClassnames("mt-5")}>
          <Title
            title={t("product.detail.whole_term_sheets")}
            className={"mt-5"}
          />
          <Content>
            <RichText html={productInfo.protocolContent} />
          </Content>
        </Box>
      }
      {productInfo.uai &&
        <Box className={twClassnames("mt-5")}>
          <Button
            onPress={() => {
              setShowUai(!showUai)
            }}
            className="my-5 h-11 flex-1 w-full  cursor-pointer"
          >
            <ButtonText>{t("product.detail.underlying_asset_information")}</ButtonText>
          </Button>
          {showUai && <Box className="mb-[25px] mt-[25px]">
            <Content>
              <RichText html={productInfo.uai} />
            </Content>
          </Box>}
        </Box>
      }
    </Box>
  );
}

function Title({ title, className }: { title: string; className?: string }) {
  return (
    <Text
      className={twClassnames(
        'whitespace-pre',
        "text-[18px] leading-[22px] font-bold text-[#151517] font-['inter'] mb-1",
        className
      )}
    >
      {title}
    </Text>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <Text
      id="content"
      className={twClassnames(
        "font-['inter'] font-normal text-[12.5674px] leading-[19px] text-[#6E6E6E] overflow-hidden"
      )}
    >
      {children}
    </Text>
  );
}

export function Overview({ product, productInfo }: { product: Product.Detail, productInfo: Product.IProductDetailList }) {
  const { t } = useTranslation()
  return (
    <Box className="flex-1 flex flex-col">
      <Title title={t("product.detail.overview")} />
      {product.aum ? <Content>{t('product.detail.AUM')}:${product.aum}</Content> : null}
      <Content>{t('product.detail.min_subscription_amount')}: {product.minSubscribeAmount} USDC</Content>
      <Content>{t('product.detail.min_redeem_amount')}: {product.redeemMinNum}</Content>
      <Content>{t('product.detail.settlement_time')}: {product.effectiveTime}</Content>
      {productInfo.assetSlice ? <Content>{t('product.detail.dividend_policy')}: {productInfo.assetSlice}</Content> : null}
    </Box>
  )
}

export function Activities({ product }: { product: Product.Detail }) {
  const { t } = useTranslation()
  const len = product.productNoticeList?.length || 0
  if (len === 0) return null
  return (
    <Box className="flex-1 flex flex-col">
      <Title
        title={t("product.detail.activities")}
      />
      {product.productNoticeList?.slice(0, 5)?.map((item, index) => (
        <Link key={index} href={`/product-activities?id=${product.productId}`}>
          <Text
            className={twClassnames(
              "font-['inter'] font-semibold text-[12.5674px] leading-[19px] text-[#FE5C01] underline"
            )}
          >{`> ${item.noticeName}`}</Text>
        </Link>
      ))}
    </Box>
  )
}