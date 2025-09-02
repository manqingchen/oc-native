import { RedemptionProcessModal } from "@/components/process/redemption.process.modal";
import {
  Button,
  Heading,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  ButtonText
} from "@/components/ui";
import { useModal } from "@/hooks/modal.hook";
import { useAssets } from "@/hooks/useAsset";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export function RedeemProgressModal() {
  const { modalCloseIcon: ModalCloseIcon } = useAssets();
  const { close } = useModal();
  const { t } = useTranslation();
  return (
    <ModalContent className="rounded-[20px] p-[15px] h-[308px]">
      <ModalHeader>
        <Heading size="md" className="text-typography-950">
          {t("toast.redeem_success.title")}
        </Heading>
        <ModalCloseButton>
          <ModalCloseIcon />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody className="flex-1 pt-2 overflow-hidden">
        <Text className="font-inter font-medium text-[14px] leading-[24px] text-black/50 mb-[29px]">
          {t("toast.redeem_progress.description")}
        </Text>
        <RedemptionProcessModal textClassName="text-[16px] leading-[19px]" />
      </ModalBody>
      <ModalFooter className="w-full">
        <Button
          className="w-full h-11 rounded-[58px]"
          onPress={() => {
            close().then(() => {
              router.push("/assetsPage");
            });
          }}
        >
          <ButtonText>{t("toast.my_account")}</ButtonText>
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}
