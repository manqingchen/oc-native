import { clearToken } from "@/api/request";
import { LANGUAGE_KEY, Language } from "@/constants/language";
import i18n from "@/messages/i18n";
import { setStorage, twClassnames } from "@/utils";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GestureResponderEvent, Image, Pressable } from "react-native";
import { Button, ButtonText, Popover, PopoverBackdrop, PopoverContent } from "../ui";
import { useAssets } from "@/hooks/useAsset";
import { usePhantomWallet } from "@/stores/phantomWalletStore";
import { useUserStore } from '@/api/request';
import { useLoginStore } from '@/stores/login.store';
export function SettingPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { setting: SettingIcon } = useAssets();
  const { wallet, setWallet } = usePhantomWallet()
  const { setIsLogin } = useLoginStore()
  const currentLanguage = i18n.language;
  console.log('wallet in setting ===================>>>>>>>>>>> ', wallet);

  const handlePress = (event: GestureResponderEvent) => {
    setIsOpen(true);
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom"
      trigger={(triggerProps) => (
        <Pressable
          {...triggerProps}
          onPress={handlePress}
          className="flex flex-row items-center gap-3"
        >
          <SettingIcon
            className="w-[32px] h-[32px]"
          />
        </Pressable>
      )}
      offset={20}
    >
      <PopoverBackdrop />
      <PopoverContent className="bg-white border border-black rounded-[22px] w-[119px] h-[134px] !p-0">
        <Button
          className={twClassnames(
            "flex-1",
            currentLanguage === Language.EN ? "bg-[#151517]" : "bg-transparent"
          )}
          onPress={() => {
            i18n.changeLanguage(Language.EN);
            setStorage(LANGUAGE_KEY, Language.EN);
            setIsOpen(false);
          }}
        >
          <ButtonText
            className={twClassnames(
              "font-[Inter] font-medium text-[17px] leading-[24px] flex items-center",
              currentLanguage === Language.EN ? "text-white" : "text-[#151517]"
            )}
          >
            {t("language.en")}
          </ButtonText>
        </Button>
        <Button
          className={twClassnames(
            "flex-1",
            currentLanguage === Language.ZH ? "bg-[#151517]" : "bg-transparent"
          )}
          onPress={() => {
            i18n.changeLanguage(Language.ZH);
            setStorage(LANGUAGE_KEY, Language.ZH);
            setIsOpen(false);
          }}
        >
          <ButtonText
            className={twClassnames(
              "font-[Inter] font-medium text-[17px] leading-[24px] flex items-center",
              currentLanguage === Language.ZH ? "text-white" : "text-[#151517]"
            )}
          >
            {t("language.zh")}
          </ButtonText>
        </Button>
        <Button
          className={twClassnames("flex-1 bg-transparent")}
          onPress={async () => {
            setWallet(undefined);
            setIsLogin(false)
            setIsOpen(false);
            clearToken();
            // await wallet.disconnect();
          }}
        >
          <ButtonText
            className="font-[Inter] font-normal text-[17px] leading-[24px] flex items-center text-black opacity-50"
          >
            {t("nav.logout")}
          </ButtonText>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
