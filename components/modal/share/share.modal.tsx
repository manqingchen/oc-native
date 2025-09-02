import {
  Box,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pressable,
  Text,
  Toast,
  ToastTitle,
  useToast
} from "@/components/ui";
import { useModal } from "@/hooks/modal.hook";
import { useAssets } from "@/hooks/useAsset";
import * as Clipboard from "expo-clipboard";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
export function ShareModal() {
  const { modalCloseIcon: ModalCloseIcon, share, toastSuccess } = useAssets();
  const { close } = useModal()
  const { t } = useTranslation();
  const shareList = useMemo(() => [
    {
      icon: share?.shareIcon1,
      title: 'X'
    },
    {
      icon: share?.shareIcon2,
      title: "Telegram",
    },
    {
      icon: share?.shareIcon3,
      title: 'WeChat'
    }
  ], [])

  const toast = useToast()
  const handleCopy = async () => {
    toast.show({
      placement: "top",
      render: () => {
        return (
          <Toast
            action="success"
            variant="solid"
            className="flex flex-row items-center gap-[11px]"
          >
            <Image source={toastSuccess} alt="toastSuccess" />
            <ToastTitle>{t("toast.replicating_success")}</ToastTitle>
          </Toast>
        );
      },
      duration: 1000,
    });
    close().then(async () => {
      await Clipboard.setStringAsync("https://youtu.be/TGxKkBC6L2k");
    })

  };
  return (
    <ModalContent className="rounded-[20px] w-[394px] py-[13px] px-6">
      <ModalHeader>
        <Text size="md" className="text-typography-950 font-[Barlow] font-semibold text-[24px] leading-[36px]">
          {t("toast.share.title")}
        </Text>
        <ModalCloseButton>
          <ModalCloseIcon />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody className="flex-1 mt-[49px] mb-[36px] flex flex-row items-center justify-around">
        <Box className="flex flex-row items-center justify-around">
          {shareList.map((item, index) => (
            <Box key={index} className="w-[100px] h-[100px] flex flex-col items-center gap-2.5">
              <Image source={item.icon} />
              <Text className="font-['Inter'] font-normal text-[14px] leading-[17px] text-[#151517]">{item.title}</Text>
            </Box>
          ))}
        </Box>
      </ModalBody>
      <ModalFooter className="w-full flex flex-col items-start">
        <Box className="w-full">
          <Text size="md" className="text-[#6E6E6E] font-[Barlow] font-normal text-[16px] leading-[19px] mb-[14px]">
            {t("toast.share.copy_link")}
          </Text>
          <Box className="border border-[#303030] rounded-[24px] p-2 flex flex-row w-full items-center justify-between">
            <Text className="font-[Roboto] font-normal text-[14px] leading-[16px] text-black pl-1">
              https://youtu.be/TGxKkBC6L2k
            </Text>
            <Pressable onPress={handleCopy}>
              <Box className="w-[80px] h-[34px] bg-black rounded-[48px] flex items-center justify-center px-6">
                <Text className="font-[Roboto] font-medium text-[14px] leading-[16px] tracking-[0.337838px] text-white">Copy</Text>
              </Box>
            </Pressable>
          </Box>
        </Box>
      </ModalFooter>
    </ModalContent>
  );
}
