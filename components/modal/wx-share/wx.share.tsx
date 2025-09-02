import {
  Button,
  ButtonText,
  Heading,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader
} from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";
import React from "react";
import { useTranslation } from "react-i18next";

export function WxShareModal() {
  const { modalCloseIcon, joinWxTitle, wxLogo } = useAssets();
  const { t } = useTranslation();
  
  const handleDownloadQRCode = () => {
    return
  };
  
  return (
    <ModalContent className="rounded-[20px] w-[394px] p-[15px]">
      <ModalHeader>
        <Heading size="md" className="text-typography-950">
          <Image source={joinWxTitle} />
        </Heading>
        <ModalCloseButton>
          <Image source={modalCloseIcon} />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody className="flex-1 mt-2 mb-[35px] w-[148.75px] h-[148.75px]">
        </ModalBody>
      <ModalFooter className="w-full">
        <Button
          className="w-full h-11 rounded-[58px]"
          onPress={handleDownloadQRCode}
        >
          <ButtonText>
            {t("toast.join_wx.button")}
          </ButtonText>
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}
