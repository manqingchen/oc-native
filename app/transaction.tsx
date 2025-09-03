import React, { useEffect } from "react";
import { useUserStore } from "@/api/request";
import { AssetsInfo } from "@/components/assetsComp/assets.info";
import { MobileCommonBar } from "@/components/nav/mobile.common.bar";
import { RedemptionProcess } from "@/components/process/redemption.process";
import { Box, Image, Text, Toast, ToastTitle, useToast } from "@/components/ui";
import { Pressable } from "react-native";
import { formatNav, formatUserId, twClassnames } from "@/utils";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Empty } from "@/components/empty";
import { useRenderMyAssetList } from "@/services/my.assets.service";
import { useMyTransactionList } from "@/hooks/useMyAssets";
import { useAssets } from "@/hooks/useAsset";
import * as Clipboard from "expo-clipboard";
import { ScrollView } from "react-native";

export default function Transaction() {
  const { t } = useTranslation();
  const language = useUserStore(state => state.language);
  const {
    data: myAssetList,
    isLoading,
    error,
    getMyTransactionList
  } = useMyTransactionList({
    language,
    limit: 100,
    cursor: 10000
  });

  // 组件挂载时获取数据
  useEffect(() => {
    getMyTransactionList();
  }, []);

  const list = useRenderMyAssetList(myAssetList as MyAssets.IMyAssetListResponse)

  return (
    <Box className="flex flex-col h-screen">
      <MobileCommonBar title={t("transaction.title")} />
      {list?.length > 0 ? (
        <ScrollView className="h-full flex-1 overflow-scroll px-5">
          <Box className="flex flex-col gap-5 pb-5 pt-5">
            {list.map((item) => (
              <TransactionMobileCard key={item.orderId} item={item} />
            ))}
          </Box>
          <Box style={{ width: 10, height: 90 }} />
        </ScrollView>
      ) : (
        <Box className="flex-1 items-center justify-center">
          <Empty />
        </Box>
      )}
    </Box>
  );
}

function TransactionMobileCard({
  item,
}: {
  item: MyAssets.IUserAsset;
}) {
  const { t } = useTranslation();
  const { redeem, subscribe, toastSuccess, copy } = useAssets();
  const toast = useToast();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.txHash);
    toast.show({
      placement: "top",
      render: () => {
        const ToastSuccessIcon = toastSuccess;
        return (
          <Toast
            action="success"
            variant="solid"
            className="flex flex-row items-center gap-[11px]"
          >
            <ToastSuccessIcon width={20} height={20} />
            <ToastTitle>{t("toast.replicating_success")}</ToastTitle>
          </Toast>
        );
      },
      duration: 3000,
    });
  };
  return (
    <Box className="w-full rounded-[28px] bg-white p-[22px] flex flex-col gap-4">
      <Box className="flex flex-row items-center justify-between">
        {item.assetType === "Subscription" ? (
          <Box className="w-[21px] h-[21px] rounded-full mr-2">
            {React.createElement(subscribe, { width: 21, height: 21 })}
          </Box>
        ) : (
          <Box className="w-[21px] h-[21px] rounded-full mr-2">
            {React.createElement(redeem, { width: 21, height: 21 })}
          </Box>
        )}
        <Text className="mr-auto font-['inter'] font-semibold text-[12.0896px] leading-[18px] text-[#151517]">
          {item.assetType === "Subscription" ? t('assets.subscribe') : t('assets.redeem')}
        </Text>
        <ProcessTag status={item.status.toLowerCase() as any} />
      </Box>
      {/* assets info */}
      <Box className="flex flex-row items-center gap-2.5">
        <Box className="w-[57px] h-[57px]  rounded-[10px]" >
          {/* <Image source={{ uri: item.product.icon }} className="w-full h-full rounded-full" /> */}
        </Box>
        <Box className="flex flex-col">
          <Text className="text-[22.668px] leading-[27px] font-bold text-[#151517] font-['inter']">
            {item.product.productName}
          </Text>
          <Text className="text-[12.0896px] leading-[18px] font-semibold text-[#929294] font-['inter']">
            {dayjs(item?.orderTime).format('YYYY-MM-DD HH:mm')}
          </Text>
          <Text className="font-['inter'] flex flex-row font-normal text-[12.0896px] leading-[18px] text-[#929294]">
            {t('trade.trade_hash')}:{formatUserId(item.txHash, 5)}
            <Pressable onPress={handleCopy} className="ml-1">
              {React.createElement(copy, { width: 16, height: 16 })}
            </Pressable>
          </Text>
        </Box>
      </Box>

      <ScrollView
        showsHorizontalScrollIndicator
        horizontal
        contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 40 }}
      >
        <AssetsInfo label={t("assets.price")} value={item.fundNetValue?.toString()} unit />
        <AssetsInfo label={t("assets.balance")} value={formatNav(item.productQuantity?.toString())} />
        <AssetsInfo label={t("assets.value")} value={formatNav(item.totalAmount?.toString())} unit className="ml-22px" />
      </ScrollView>

      {/* {item.status !== "SEND_USER_SUCCESS" && */}
      <RedemptionProcess process={item.assetStatusList} currentStep={(item.assetStatusList?.map((i: any, index: number) => i.isProcess === true ? index : -1).filter((index: number) => index !== -1).pop() ?? -1) + 1} />
      {/* } */}
    </Box>
  );
}

export function ProcessTag({
  status,
}: {
  status: "processing" | "SEND_USER_SUCCESS" | string
}) {
  const { t } = useTranslation();
  const statusConfig: Record<string, { bgColor: string; color: string }> = {
    processing: {
      bgColor: "bg-[#C1C1C1]",
      color: "text-[#151517]",
    },
    send_user_success: {
      bgColor: "bg-[#FE5F00]",
      color: "text-white",
    },
  };

  const curStatus = statusConfig[status] ? "finished" : "processing"
  return (
    <Box
      className={twClassnames(
        "rounded-[10px] py-[1px] px-[14px] inline-flex",
        statusConfig[status]?.bgColor || statusConfig.processing.bgColor
      )}
    >
      <Text
        className={twClassnames(
          "font-['inter'] font-semibold text-[12.0896px] leading-[18px] whitespace-nowrap",
          statusConfig[status]?.color || statusConfig.processing.color
        )}
      >
        {t(`transaction.${curStatus}`)}
      </Text>
    </Box>
  );
}
