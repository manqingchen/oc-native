import { Box, Text } from "@/components/ui";
import { Image } from "@/components/ui";
import Link from "expo-router/link";
import { useTranslation } from "react-i18next";
import { RedemptionProcess } from "../process/redemption.process";
import { AssetsInfo } from "./assets.info";
import { formatNav } from "@/utils";
import { ScrollView } from "react-native";
import { AssetsProcessTag } from "./assets.process";
export const AssetsCard = ({ item }: { item: MyAssets.IUserAsset }) => {
  const { t } = useTranslation();
  return (
    <Box className="w-full rounded-[28px] bg-white p-[22px] gap-4">
      <Box className="gap-4 flex flex-col">
        {/* assets info */}
        <Box className="flex flex-row items-center gap-2.5 relative mt-4">
          <Box style={{
            overflow: 'hidden',
            borderRadius: 10,
            width: 57, height: 57,
          }} >
            <Image
              source={{
                uri: item?.product?.icon,
              }}
              alt='product-icon'
              style={{ width: 57, height: 57, overflow: 'hidden', borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
            />
          </Box>
          <Box className="flex flex-col gap-1">
            <Text className="text-[22.668px] leading-[27px] font-bold text-[#151517] font-['inter']">
              {item?.product?.productName}
            </Text>
            <Text className="text-[12.0896px] leading-[18px] font-semibold text-[#151517] font-['inter']">
              {item?.product?.subtitle}
            </Text>
          </Box>
          <Box className="absolute right-0 top-0">
            <AssetsProcessTag status={item.status.toLocaleLowerCase()} />
          </Box>
        </Box>

        <ScrollView showsHorizontalScrollIndicator={false} horizontal className='flex flex-row mt-4' >
          <AssetsInfo label={t("assets.price")} value={item.fundNetValue?.toString()} unit  />

          <AssetsInfo label={t("assets.value")} value={formatNav(item.totalAmount?.toString())} unit  />

          <AssetsInfo label={t("assets.return")} value={formatNav(item?.assetYeild?.toString())} unit />
          <AssetsInfo label={t("assets.points")} value={item.points?.toString() || '2222222222222222222222222220'}  />
        </ScrollView>
        <RedemptionProcess process={item?.assetStatusList} currentStep={(item?.assetStatusList?.map((f: any, index: number) => f.isProcess ? index : -1).filter((index: number) => index !== -1).pop() ?? -1) + 1} />

        <Box className="flex flex-row gap-3 mt-4">
          <Link
            href={`/trade?id=${item.product.productId}&type=redeem`}
            className="flex flex-row items-center flex-1"
          >
            <Box className="py-2  border border-black w-full rounded-full px-[19px] flex-1 flex justify-center items-center">
              <Text className="font-['inter'] text-[14px]  leading-[24px] text-black font-medium">
                {t("assets.redeem")}
              </Text>
            </Box>
          </Link>

          <Link
            href={`/trade?id=${item.product.productId}&type=subscribe`}
            className="flex flex-row items-center flex-1"
          >
            <Box className="py-2 bg-black px-[12px] rounded-full w-full flex-1 flex justify-center items-center">
              <Text className="font-['inter'] text-[14px] leading-[24px] text-white font-medium">
                {t("assets.subscribe")}
              </Text>
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
