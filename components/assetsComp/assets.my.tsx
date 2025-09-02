import { useUserStore } from "@/api/request";
import { Box, Image, Pressable, Text } from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";
import { formatAmount } from "@/utils";
import { useEffect, useState } from "react";
import { useMyAssetsStore } from "@/stores/my.assets.store";
import { useTranslation } from "react-i18next";
import { useMyAssetsInfo } from "@/hooks/useMyAssets";
import {ProductLineOnlyChart} from '@/components/chart/product.echarts.lineonly'
import { ProductTrendChart } from "@/components/chart/product.echarts";

export const MyAssetsInfo = () => {
  const { t } = useTranslation();
  const [isShowChart, setIsShowChart] = useState(false);
  const { myAssetsTop } = useAssets();
  const dwm = useMyAssetsStore(state => state.dwm);
  const {language, token} = useUserStore();
  const { data: myAssets, getMyAssetsInfo } = useMyAssetsInfo({
    language,
    dwm,
  })
  useEffect(() => {
    getMyAssetsInfo()
  }, [])
  const userAssetsList = myAssets?.userAssetList || [] 
  console.log('userAssetsList ===================>>>>>>>>>>> ', userAssetsList);
  return (
    <Box className="flex flex-col justify-between bg-white rounded-3xl p-5 relative">
      <Text className="font-['inter'] text-[10.62px] leading-[13px] font-normal text-[#929294]">
        {t("assets.onchain_asset_value")}
      </Text>
      <Box className="flex flex-row justify-between my-5">
        <Text className="font-['inter'] text-[26px] leading-[31px] font-bold text-[#151517]">
          {formatAmount(myAssets?.assetValue)}
          <Text className="font-['inter'] text-[14px] leading-[17px] font-normal text-[#151517] relative">
            {Number(myAssets?.assetGap) === 0 || !token ? null : (

              <Box className="h-4 p-1 bg-[#DDFFEF] ml-[45%] flex items-center justify-center rounded absolute -top-6 -right-3.5">
                <Text className="font-['inter'] text-[10px] font-semibold text-[#00BD65]">
                  +{formatAmount(myAssets?.assetGap)}{t('assets.today')}
                </Text>
              </Box>
            )}
            {t("product.detail.USDC")}
          </Text>
        </Text>
        {isShowChart ? (
          <Pressable onPress={() => setIsShowChart(false)}>
            <Image source={myAssetsTop} />
          </Pressable>
        ) : (
          <Pressable onPress={() => setIsShowChart(true)}>
            <Box className="w-[77px] h-[25px] absolute right-9.5 top-12">
              {/* <ProductLineOnlyChart height={24} data={userAssetsList} /> */}
            </Box>
          </Pressable>
        )}
      </Box>
      {/* {isShowChart && (
        <Box className="">
          <ProductTrendChart data={userAssetsList} />
        </Box>
      )} */}

      <Box className="flex flex-row justify-between">
        <Box className="flex flex-col gap-[3px] flex-1">
          <Text className="font-['inter'] text-[10.62px] leading-[13px] font-normal text-[#929294]">
            {t("assets.total_yield")}
          </Text>
          <Text className="font-['inter'] text-[14px] leading-[17px] font-normal text-[#151517]">
            {formatAmount(myAssets?.yield)}

            <Text className="font-['inter'] text-[10.62px] leading-[13px] font-normal text-[#000] ml-[2px]">
              {t("product.detail.USDC")}
            </Text>
          </Text>
        </Box>
        <Box className="flex flex-col gap-[3px] flex-1">
          <Text className="font-['inter'] text-[10.62px] leading-[13px] font-normal text-[#929294]">
            {t("assets.onchain_point")}
          </Text>
          <Text className="font-['inter'] text-[14px] leading-[17px] font-normal text-[#151517]">
            {formatAmount(myAssets?.points)}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
