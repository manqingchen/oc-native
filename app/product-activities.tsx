import { MobileCommonBar } from "@/components/nav/mobile.common.bar";
import { RichText } from "@/components/richText/richText";
import { Box, Text } from "@/components/ui";
import { useProductDetail } from "@/hooks/useProducts";
import { useMyAssetsStore } from "@/stores/my.assets.store";
import { twClassnames } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView } from "react-native";

export default function ProductActivities() {
  const { id } = useLocalSearchParams() as { id: string }
  const dwm = useMyAssetsStore(s => s.dwm)
  const { productDetail, getProductDetail } = useProductDetail(id);

  useEffect(() => {
    getProductDetail({
      id,
      dwm
    })
  }, [dwm, id])
  if(!productDetail) return null
  return (
    <Box className="h-full ">
      <MobileCommonBar />
      <ScrollView className="flex-1 h-full px-5">
        {productDetail?.productNoticeList?.slice(0, 5)?.map((item, index) => (
          <Box key={index} className={twClassnames(
            "mt-[19px] px-5 gap-5 mb-[298px]"
          )}>
            <Text
              className={twClassnames(
                "font-['inter'] font-semibold text-[12.5674px] leading-[19px] text-[#FE5C01]"
              )}
            >
              <RichText html={item.noticeContent} />
            </Text>
          </Box>
        ))}
      </ScrollView>
    </Box>
  )
}