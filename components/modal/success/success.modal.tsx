import {
  Button,
  ButtonText,
  Heading,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@/components/ui";
import { useModal } from "@/hooks/modal.hook";
import { useAssets } from "@/hooks/useAsset";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";

export function SuccessModal() {
  const { successModalIcon: SuccessModalIcon , modalCloseIcon: ModalCloseIcon } = useAssets();
  const { close } = useModal();
  const {t} = useTranslation()
  return (
    <ModalContent className="rounded-[20px] p-[15px] !pt-0">
      <ModalHeader className=" pt-[14px] mt-[14px] h-[36px]">
        <Heading size="md" className="text-typography-950 text-[22px] leading-[22px] h-[22px]">
          {t("toast.redeem_success.title")}
        </Heading>
        <ModalCloseButton>
          <ModalCloseIcon />
        </ModalCloseButton>
      </ModalHeader>
      <ModalBody className="mx-auto mt-3 mb-[11px]">
        <SuccessModalIcon style={{ width: 115, height: 115, margin: 'auto' }} />

        <Text className="font-inter font-medium text-[14px] leading-[24px] text-black/50">
          {t("toast.redeem_success.redeem_feedback")}
        </Text>
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
