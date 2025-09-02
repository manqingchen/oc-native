import { MobileCommonBar } from "@/components/nav/mobile.common.bar";
import { Box, Pressable, Text } from "@/components/ui";
import { useSystemMessage } from "@/hooks/system.hook";
import { formatNav, formatUserId } from "@/utils";
import dayjs from "dayjs";
import { Link } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Empty } from "@/components/empty";
import { ScrollView } from "react-native";
import { useReadNotice } from "@/hooks/useMyAssets";

export default function SystemMessage() {
  const { t } = useTranslation();
  const { noticesList, handleDeleteNotice } = useSystemMessage()
  const { readNotice } = useReadNotice()
  useEffect(() => {
    readNotice()
  }, [])
  const render = () => {
    if (noticesList?.length) {
      return (
        noticesList.map(item => (
          <SystemMessageContent deleteNotice={handleDeleteNotice} key={item.id} item={item} />
        ))
      )
    }
    return <Box className="flex items-center justify-center flex-1"><Empty /></Box>
  }
  return (
    <Box>
      <MobileCommonBar title={t("system-message.title")} />
      <ScrollView>
        <Box className="gap-2.5 h-full flex flex-col pb-5">
          {render()}
        </Box>
      </ScrollView>
    </Box>
  );
}

export const NoticeType = ['trade.subscribe', 'trade.redeem', 'trade.settle']
export function SystemMessageContent({
  item,
  close,
  deleteNotice,
}: {
  close?: () => void;
  item?: MyAssets.IMyNoticeList;
  deleteNotice?: (id: number) => void;
}) {
  const { t } = useTranslation();

  const tpyeMap = [t('system-message.subscription_successful'), t('system-message.redemtion_successful')]
  return (
    <Pressable onLongPress={() => item?.id && deleteNotice?.(item?.id)}>
      <Box className="flex flex-col">
        <Text className="font-inter font-normal text-[14px] leading-[20px] text-center w-full text-[#747474] opacity-50">
          {item?.sendTime}
        </Text>
        <Box className="bg-white rounded-[28px] flex flex-col mt-2 p-5 gap-[18px]">
          <Text className="font-inter font-normal text-[14px] leading-[17px] text-justify text-black">
            {tpyeMap[item?.type || 0]}
          </Text>
          <Box className="flex flex-col">
            <Text className="font-inter font-normal text-[14px] leading-[17px] text-black text-center shrink-0">
              {item?.productName}
            </Text>
            <Text className="font-inter font-bold text-[26px] leading-[31px] text-[#151517] text-center">
              ${formatNav(item?.orderAmount)}
            </Text>
          </Box>
          <Box className="flex flex-col gap-[7px]">
            <Text className="font-['inter'] font-normal text-[12px] leading-[15px] text-justify text-[#929294] flex flex-row items-center shrink-0">
              {t("system-message.transaction_address")}
              <Box className="w-2.5" />
              {formatUserId(item?.userAddress || '', 6, 6)}
            </Text>
            <Text className="font-['inter'] font-normal text-[12px] leading-[15px] text-justify text-[#929294] flex flex-row items-center shrink-0">
              {t("system-message.transaction_time")}
              <Box className="w-2.5" />
              {item?.txTime}
            </Text>
            <Text className="font-['inter'] font-normal text-[12px] leading-[15px] text-justify text-[#929294] flex flex-row items-center">
              {t("system-message.transaction_type")}
              <Box className="w-2.5" />
              {t(NoticeType[item?.type || 0])}
            </Text>
          </Box>
          <Box className="flex flex-row items-center justify-center gap-4">
            <Pressable onPress={close} className="flex-1">
              <Link
                href="/assetsPage?type=my-assets&uid=123"
                className="border border-[#151517] rounded-3xl p-[10px] flex-1 items-center justify-center flex"
              >
                <Text className="font-inter font-medium text-[14px] leading-[24px] text-black">
                  {t("system-message.my_assets")}
                </Text>
              </Link>
            </Pressable>
            <Pressable onPress={close} className="flex-1">
              <Link
                href={"/transaction"}
                className="bg-[#151517] rounded-3xl p-[10px] flex-1 items-center justify-center flex"
              >
                <Text className="font-inter font-medium text-[14px] leading-[24px] text-white">
                  {t("system-message.transaction")}
                </Text>
              </Link>
            </Pressable>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
}
