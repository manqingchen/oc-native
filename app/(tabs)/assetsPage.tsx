import { useUserStore } from "@/api/request";
import { Box, Image, Text } from "@/components/ui/";
import { useAssets } from "@/hooks/useAsset";
import { useMyAssetList } from "@/hooks/useMyAssets";
import { MobileHomeBar } from '@/components/nav/mobile.home.bar';
import { twClassnames } from "@/utils";
// import {MyAssetsInfo} from '@/components/assetsComp/assets.my'
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "expo-router/link";
import { AssetsCard } from "@/components/assetsComp/assets.card";
import { usePhantomWallet } from '@/stores/phantomWalletStore'
import { ScrollView } from "react-native";
import { MyAssetsInfo } from "@/components/assetsComp/assets.my";

export default function AssetsPage() {
  // 获取URL参数
  const { orderHistory: OrderHistoryIcon } = useAssets()
  const { t } = useTranslation();
  const language = useUserStore(state => state.language);
  const { wallet } = usePhantomWallet()

  const { data: myAssetList, getMyAssetList } = useMyAssetList({
    language,
    limit: 1000,
    cursor: 10000
  });

  console.log('myAssetList ===================>>>>>>>>>>> ', myAssetList);
  useEffect(() => {
    getMyAssetList({
      limit: 1000,
      cursor: 10000
    })
  }, [])
  return (
    <Box className="flex flex-col">
      <MobileHomeBar />
      <ScrollView className={twClassnames("pt-2 px-5")}>
        <Box className={twClassnames("pb-[60px]")}>
          <MyAssetsInfo />
          <Box className="mt-[17px] mb-[21px] flex flex-row justify-between" >
            <Text className={twClassnames("pl-4 font-['Roboto'] font-medium text-[18px] leading-[21px] text-black")}>
              {t('my.my_assets')}
            </Text>
            <Link href={'/transaction'}>
              <OrderHistoryIcon />
            </Link>
          </Box>
          <Box className="gap-5 flex flex-row flex-wrap mb-10">
            {myAssetList?.map((item, index) =>
              <AssetsCard key={index} item={item} />
            )}
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );

}
