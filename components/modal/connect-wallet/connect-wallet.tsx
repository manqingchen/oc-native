import {
  Box,
  Heading,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Pressable,
  Text,
} from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";
// import { useWalletInfo } from "@/hooks/wallet.hook";
import { usePhantomWallet } from '@/stores/phantomWalletStore'
import { supportWallets } from '@/lib/config'
import { t } from "i18next";

export function ConnectWalletModal() {
  const { modalCloseIcon:ModalCloseIcon, nextIcon, modalTitleIcon: ModalTitleIcon } = useAssets();
  const { wallet } = usePhantomWallet()

  return (
    <ModalContent className="rounded-[20px] p-[15px]">
      <ModalHeader className="flex flex-row items-center justify-between">
        <Box className="flex flex-row items-center">
          <ModalTitleIcon className="mr-2" />
          <Heading
            size="md"
            className="text-typography-950 font-inter font-semibold text-[22px] leading-[36px] text-center"
          >
            {t("toast.connect_wallet.title")}
          </Heading>
        </Box>
        <ModalCloseButton>
          <ModalCloseIcon />
        </ModalCloseButton>
      </ModalHeader>
      <Pressable
        onPress={(event) => {
          wallet?.connect()
        }}
        style={{
          paddingBottom: 20,
          paddingTop: 20,
        }}
        className='flex items-center justify-center'
      >
        <Image
          source={supportWallets.icon}
          alt="phantom"
          size="none"
          className="w-[60px] h-[60px]"
          resizeMode="contain"
        />
      </Pressable>
      {/* 
      <Box className="flex flex-row justify-center">
        <Text className="font-urbanist font-normal text-[12px] leading-[150%] flex items-center text-black text-center">
          {t("toast.connect_wallet.tips")}
        </Text>
        <Image
          source={nextIcon}
          className="ml-2.5"
          style={{
            width: 20,
            height: 20,
          }}
        />
      </Box> */}
    </ModalContent>
  );
}
