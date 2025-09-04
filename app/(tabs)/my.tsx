import { useAssets } from "@/hooks/useAsset";
import { formatUserId, twClassnames } from "@/utils";
import { OnchainDocSection } from "@/constants/oc.doc";
import * as Clipboard from "expo-clipboard";
import Link from "expo-router/link";
import { Box, Text, Toast, ToastTitle, Pressable, Image, useToast, ButtonText, Button } from "@/components/ui/";
import { usePhantomWallet } from '@/stores/phantomWalletStore'
import React from "react";
import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import { MobileCommonBar } from "@/components/nav/mobile.common.bar";
import { useUserStore } from "@/api/request";
import { ContactInformation } from '@/components/footer/contact.information'
import { ModalType } from "@/constants/modal";
import { useModal } from "@/hooks/modal.hook";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useWalletStore } from "@/stores/wallet.store";
import { supportWallets } from '@/lib/config'
import { showToast } from "@/utils/toast";

export default function My() {
  const { myAssetsRight: MyAssetsRightIcon } = useAssets();
  const { t } = useTranslation();
  const { wallet } = usePhantomWallet()
  const connected = wallet?.isConnected
  // const { myAssetsRight } = useAssets();
  // const {  } = useWallet();
  return (
    <Box className="pb-[60px]">
      <MobileCommonBar />
      <ScrollView className='px-5'>
        {connected ? (
          <UserInfo />
        ) : (
          <>
            <Text className="font-inter text-[30px] leading-[36px] text-justify tracking-[-0.03em] font-bold text-black mt-[26px]">
              {t("my.welcome")}
            </Text>
            <Text className="font-inter font-normal text-[14px] leading-[20px] text-justify text-[#747474] opacity-50">
              {t("my.empower")}
            </Text>
          </>
        )}
        {connected && <MyWallet />}
        <Box className="mt-[25px]">
          <Text className="mb-2.5">{t("my.service")}</Text>
          <Wrapper>
            <Item
              title={t("my.my_assets")}
              href="/assetsPage"
              icon={<MyAssetsRightIcon />}
            />
            <Item
              title={t("my.transaction")}
              href="/transaction"
              icon={<MyAssetsRightIcon />}
            />
            <Item
              title={t("my.products")}
              href="/products"
              icon={<MyAssetsRightIcon />}
            />
          </Wrapper>
        </Box>
        <Box className="mt-4">
          <Text className="mb-2.5">{t("my.user_guide")}</Text>
          <Wrapper>
            <Item
              title={t("onchainDocs.about_onchain.title")}
              href={'/onchainDocs'}
              icon={<MyAssetsRightIcon />}
            />
            <Item
              title={t("onchainDocs.how_it_works.title")}
              href={`/onchainDocs?id=${OnchainDocSection.HOW_TO_START}`}
              icon={<MyAssetsRightIcon />}
            />
            <Item
              title={t("onchainDocs.trust_security.title")}
              href={`/onchainDocs?id=${OnchainDocSection.WALLET_GUIDE}`}
              icon={<MyAssetsRightIcon />}
            />
            <Item
              title={t("onchainDocs.contact_us.title")}
              href={`/onchainDocs?id=${OnchainDocSection.CONTACT_US}`}
              icon={<MyAssetsRightIcon />}
            />
          </Wrapper>
        </Box>
        <Box className="flex items-center mt-5 mb-5">
          <Text className="font-inter text-[15px] leading-[24px] tracking-[0.2px] text-right font-medium text-black">
            Stay Connected
          </Text>
          <ContactInformation className="mt-0.5" />
        </Box>
      </ScrollView>
    </Box>
  );
}

function MyWallet() {
  const { t } = useTranslation();
  const { copy: CopyIcon, myAddress: MyAddressIcon, toastSuccess } = useAssets();
  const toast = useToast();
  const { wallet } = usePhantomWallet()
  const publicKey = wallet?.address
  const { balance, loading } = useWalletStore();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(publicKey?.toString() || "");
    showToast.success(t("toast.replicating_success"))
  };
  return (
    <Box className="mt-[25px]">
      <Text className="mb-2.5">{t("my.my_wallet")}</Text>
      <Wrapper className="gap-0 pr-[14px]">
        <Box className="flex flex-row justify-between items-center h-5">
          <Text className="font-inter text-[14px] mr-[7px] leading-[20px] font-normal text-justify text-[#747474] opacity-50">
            {t("my.balance")}
          </Text>
          <Box className="flex flex-row items-center gap-1">
            <Image
              source={supportWallets.icon}
              size="none"
              className="w-4 h-4"
              resizeMode="contain"
            />
            <Text className="font-inter text-[14px] leading-[20px] font-normal text-justify text-[#787878]">
              {formatUserId(publicKey?.toString() || "", 3, 5)}
            </Text>
            <Pressable onPress={handleCopy}>
              <CopyIcon />
            </Pressable>
          </Box>
        </Box>
        <Box className="flex flex-row justify-start items-end gap-2 mt-[22px] ">
          <Text className="font-inter text-[26px] leading-[31px] font-bold text-[#151517]">
            {loading ? "..." : balance}
          </Text>
          <Text className="font-inter text-[14px] leading-[24px] font-medium text-black">
            {" "}
            {t("product.detail.USDC")}{" "}
          </Text>
        </Box>
      </Wrapper>
    </Box>
  );
}

function UserInfo() {
  const { t } = useTranslation();
  const { copy: CopyIcon, toastSuccess: ToastSuccessIcon, myAddress: MyAddressIcon } = useAssets();
  const { wallet } = usePhantomWallet()
  const address = wallet?.address
  const toast = useToast();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(address?.toString() || "");
    showToast.success(t("toast.replicating_success"))
  };

  return (
    <Box className="flex flex-row items-center gap-2.5">
      <Image
        source={supportWallets.icon}
        size="none"
        className="w-[58px] h-[58px]"
        resizeMode="contain"
      />
      <Box className="flex flex-col gap-1">
        <Text className="font-roboto text-[20px] leading-[23px] font-medium text-black text-justify"> OnChain User </Text>
        <Box className="flex flex-row items-center">
          <Text className="font-inter text-base leading-[19px] text-justify text-black opacity-50">
            {t("my.IDLabel")}
            {formatUserId(address || "", 5, 4)}
          </Text>
          <Pressable onPress={handleCopy} className="ml-1">
            <CopyIcon />
          </Pressable>
        </Box>
      </Box>
    </Box>
  );
}
function Wrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Box
      className={twClassnames(
        "bg-white rounded-[28px] pl-[18px] pr-[26px] py-[20px] gap-6",
        className
      )}
    >
      {children}
    </Box>
  );
}
function Item({
  title,
  icon,
  href,
}: {
  title: string;
  icon: React.ReactNode;
  href?: any;
}) {
  return (
    <>
      {href ? (
        <Link href={href}>
          <Box className="flex flex-row justify-between items-center w-full">
            <Text>{title}</Text>
            {icon}
          </Box>
        </Link>
      ) : (
        <Box className="flex flex-row justify-between items-center w-full">
          <Text>{title}</Text>
          {icon}
        </Box>
      )}
    </>
  );
}
