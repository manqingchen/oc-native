import { Box, Center, Image, Input, Pressable, Text } from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";
import { useTrade } from "@/hooks/useTrade";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useFofStore } from "@/stores/fof.store";
import { useTradeStore } from "@/stores/trade.store";
import { useWalletStore } from "@/stores/wallet.store";
import { twClassnames } from "@/utils";
import { formatRedeem, formatSubscribe } from "@/utils/format";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";

export function ProductDetailMobileTrade(props?: {
  setType: (type: "subscribe" | "redeem") => void;
  type: "subscribe" | "redeem";
  product: Product.Detail;
}) {
  const { handleClick, amount, setAmount, cannotPurchase, disabledNext, indicativeQuantity, transactionText, setIndicativeQuantity, activeTab, setActiveTab, changeAmount, changeIndicativeQuantity } = useTrade({
    product: props?.product as Product.Detail,
  })
 
   const {getFofBalance} = useWalletBalance()
   const { fof, setFundName } = useFofStore()
   
   useEffect(() => {
     const token = props?.product?.token
     if(token && fof) {
       getFofBalance(token)
       setFundName(token)
     }
   }, [fof, props?.product]) 
  const { t } = useTranslation();

  const handleSwitchTab = (tab: "subscribe" | "redeem") => {
    setActiveTab(tab);
    props?.setType(tab);
    setAmount("");
    setIndicativeQuantity("");
  };

  return (
    <Box className="w-full shrink-0 rounded-lg flex flex-col">
      <SwitchButton activeTab={activeTab} setActiveTab={handleSwitchTab} />

      <Box className="relative mt-[29px]">
        {activeTab === 'subscribe' ? (
          <SubscribeAmount amount={amount} activeTab={activeTab} setAmount={changeAmount} product={props?.product} />
        ) : (
          <IndicativeQuantity
            amount={indicativeQuantity}
            product={props?.product}
            setAmount={changeIndicativeQuantity}
            activeTab={activeTab}
          />
        )}
        <Box className="absolute top-1/2 -translate-y-1/4 left-1/2 -translate-x-1/2 z-10">
          <Pressable
            onPress={() =>
              handleSwitchTab(
                activeTab === "subscribe" ? "redeem" : "subscribe"
              )
            }
          >
            <Center className="w-10 h-10 rounded-full">
              {/* <Image source={upsideDown} className="w-[33px] h-[33px]" /> */}
            </Center>
          </Pressable>
        </Box>

        <Box className="mt-[29px]">
          {activeTab === 'subscribe' ? (
            <IndicativeQuantity
              amount={indicativeQuantity}
              product={props?.product}
              activeTab={activeTab}
              setAmount={changeIndicativeQuantity}
            />
          ) : (
            <SubscribeAmount amount={amount} activeTab={activeTab} setAmount={changeAmount} />
          )}
        </Box>
      </Box>

      <Box className="mt-4 ">
        <Text className="font-['PingFang SC'] text-[14px] leading-[20px] font-semibold text-[#151517]">
          {t("product.detail.transaction_info")}
        </Text>
        <Box className="mt-1 flex flex-col">
          {activeTab === 'subscribe' ? (
            <>
              <Text className="font-['inter'] text-[14px] leading-[24px] font-normal text-[#6E6E6E]">{t('product.detail.min_subscription_amount')}: {props?.product?.minSubscribeAmount} USDC</Text>

              <Text className="font-['inter'] text-[14px] leading-[24px] font-normal text-[#6E6E6E]">
                {t("trade.subscribe_fees")}: {formatSubscribe({
                  product: props?.product
                })}
              </Text>

            </>
          ) : (
            <>

              <Text className="font-['inter'] text-[14px] leading-[24px] font-normal text-[#6E6E6E]">{t('product.detail.min_redeem_amount')}: {props?.product?.redeemMinNum}</Text>
              <Text className="font-['inter'] text-[14px] leading-[24px] font-normal text-[#6E6E6E]">
                {t("trade.redeem_fees")}: {formatRedeem({
                  product: props?.product
                })}
              </Text>

            </>
          )}
        </Box>
      </Box>

      {cannotPurchase && <Text className="text-[#D81747] text-center mt-5 text-[12px] leading-[15px] font-normal font-['inter']">
        {cannotPurchase}
      </Text>}

      <Pressable className="mt-[9px]" onPress={handleClick}>
        <Box className={twClassnames("bg-black py-3 rounded-full flex items-center justify-center", disabledNext ? "bg-[#8C8C8C]" : "")}>
          <Text className="text-white text-center font-medium">
            {transactionText}
          </Text>
        </Box>
      </Pressable>

      <Text className="text-[#6E6E6E] text-[8px] leading-[24px] text-center font-normal font-['inter']">
        {t('trade.privacy_Policy')}
      </Text>

    </Box>
  );
}

function SwitchButton({
  activeTab,
  setActiveTab,
}: {
  activeTab: "subscribe" | "redeem";
  setActiveTab: (tab: "subscribe" | "redeem") => void;
}) {
  const { t } = useTranslation();
  return (
    <Box className="flex flex-row rounded-[41px] overflow-hidden border border-[#DEDEDE]">
      <Pressable onPress={() => setActiveTab("subscribe")} className="flex-1 bg-white">
        <Center
          className={`py-2.5 rounded-full ${activeTab === "subscribe" ? "bg-black" : ""
            }`}
        >
          <Text
            className={`font-medium text-[14px] leading-[24px] ${activeTab === "subscribe" ? "text-white font-bold" : "text-black"
              }`}
          >
            {t("button.subscribe")}
          </Text>
        </Center>
      </Pressable>

      <Pressable onPress={() => setActiveTab("redeem")} className="flex-1 bg-white">
        <Center
          className={`py-2.5 rounded-full ${activeTab === "redeem" ? "bg-black" : "bg-white"
            }`}
        >
          <Text
            className={`font-medium text-[14px] leading-[24px] ${activeTab === "redeem" ? "text-white font-bold" : "text-black"
              }`}
          >
            {t("button.redeem")}
          </Text>
        </Center>
      </Pressable>
    </Box>
  );
}

function SubscribeAmount({
  amount,
  setAmount,
  activeTab,
  product
}: {
  amount: string;
  setAmount: (amount: string) => void;
  activeTab: "subscribe" | "redeem";
  product?: Product.Detail;
}) {
  const { t } = useTranslation();
  const { balance } = useWalletStore();

  const { subscribeAmount } = useAssets();
  return (
    <Box className="">
      <Text className="font-['inter'] text-[12px] leading-[24px] font-normal text-[#6E6E6E]">
        {activeTab === "subscribe"
          ? t("product.detail.subscribe_amount")
          : t("product.detail.indicative_quantity")}
      </Text>
      <Box className="border border-[#2C2C2C] h-12 rounded-full pl-[13px] pr-[18px] py-[11px] flex flex-row items-center justify-between">
        <Box className="flex flex-row items-center flex-1 bg-red">
          <Box className="w-[25px] h-[25px] rounded-full mr-[15px] flex items-center justify-center shrink-0">
            <Image source={subscribeAmount} className="w-full h-full rounded-full shrink-0" alt='' style={{
              width: 25,
              height: 25,
              borderRadius: '50%'
            }} />
          </Box>
          <Input value={amount} onChangeText={setAmount} placeholder={activeTab === "subscribe" ? `${t("trade.minimum")} ${product?.minSubscribeAmount || '-'}` : '0.00'} />
        </Box>
        <Text className="font-['inter'] text-[14px] leading-[24px] font-normal text-[#6E6E6E] text-right shrink-0 ml-1">
          {t("product.detail.bal")}: {balance} {t("product.detail.USDC")}
        </Text>
      </Box>
    </Box>
  );
}

function IndicativeQuantity({
  amount,
  setAmount,
  product,
  activeTab
}: {
  amount: string;
  setAmount: (amount: string) => void;
  product?: Product.Detail;
  activeTab: "subscribe" | "redeem";
}) {
  const { t } = useTranslation();
  const { assetBalance } = useWalletStore();
  return (
    <Box className="relative">
      <Text className="font-['inter'] text-[12px] leading-[24px] font-normal text-[#6E6E6E]">
        {activeTab === "subscribe" ? t("product.detail.indicative_quantity") : t("product.detail.redeem_amount")}
      </Text>

      <Box className="border border-[#2C2C2C] h-12 rounded-full pl-[13px] pr-[18px] py-[11px] flex flex-row items-center justify-between">
        <Box className="flex flex-row items-center flex-1">
          <Box className="w-[25px] h-[25px] rounded-full mr-[15px] flex items-center justify-center shrink-0">
            <Image source={{ uri: product?.icon }} className="w-full h-full rounded-full shrink-0" alt='' />
          </Box>
          <Input value={amount} onChangeText={setAmount} placeholder={activeTab === "redeem" ? `${t("trade.minimum")} ${product?.redeemMinNum}` : '0.00'} />
        </Box>
        <Text className="font-['inter'] text-[14px] leading-[24px] font-normal text-[#6E6E6E] text-right shrink-0 ml-1">
          {t("product.detail.bal")}: {assetBalance} {product?.productName}
        </Text>
      </Box>
    </Box>
  );
}
