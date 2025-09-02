import { OnchainDocSection } from "@/constants/oc.doc";
import { twClassnames } from "@/utils";
import { usePathname, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GestureResponderEvent, Image, Pressable } from "react-native";
import { Box, Text } from "../ui";
import {
  Popover,
  PopoverBackdrop,
  PopoverBody,
  PopoverContent,
} from "../ui/popover";
import { useAssets } from "@/hooks/useAsset";
import { useScrollStore } from "@/stores/scorll.store";

export const MobileDocBar = ({ title }: { title?: string }) => {
  const { commonBack: CommonBackIcon, setting } = useAssets();
  const router = useRouter();
  const pathname = usePathname();
  const isMyRoute = pathname === "/my";
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const LeftButton = () => {
    return (
      <Pressable onPress={handleBackPress}>
        <CommonBackIcon />
      </Pressable>
    );
  };
  return (
    <Box
      style={{
        height: 40,
      }}
      className="flex flex-row items-center justify-between mx-6 mt-3 pb-1 h-11 shrink-0"
    >
      <Box className="">
        <LeftButton />
      </Box>

      <Box className="flex flex-row items-start" >
        <MenuPopover />
      </Box>
    </Box>
  );
};

export function MenuPopover({ children }: { children?: React.ReactNode }) {
  const { menu, close } = useAssets();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const handlePress = () => {
    setIsOpen(true);
  };
  const { scrollToSection } = useScrollStore();

  console.log('isOpen', isOpen)
  const handleSectionPress = (sectionId: string) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId);
    setIsOpen(false);
  };
  const { t } = useTranslation();

   const sections = [
    {
      id: OnchainDocSection.ABOUT_ONCHAIN,
      label: t("onchainDocs.about_onchain.title"),
    },
    {
      id: OnchainDocSection.HOW_TO_START,
      label: t("onchainDocs.how_it_works.title"),
    },
    {
      id: OnchainDocSection.WALLET_GUIDE,
      label: t("onchainDocs.trust_security.title"),
    },
    {
      id: OnchainDocSection.CONTACT_US,
      label: t("onchainDocs.contact_us.title"),
    },
  ];

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom"
      offset={20}
      trigger={(triggerProps) => (
        <Pressable
          {...triggerProps}
          onPress={handlePress}
          className="flex flex-row items-center gap-3"
        >
          {children ?? (
            <>
              <Text className="font-inter text-[14px] leading-[24px] text-black font-medium">
                {t('nav.menu')}
              </Text>
              <Image source={isOpen ? close : menu} alt="menu" />
            </>
          )}
        </Pressable>
      )}
    >
      <PopoverBackdrop />
      <PopoverContent
        style={{
          backgroundColor: "white",
          borderWidth: 1,
          borderColor: "black",
          borderRadius: 20,
          width: 208,
        }}
      >
        <PopoverBody>
          {sections.map((section, index) => (
            <Pressable
              key={section.id}
              onPress={() => handleSectionPress(section.id)}
              className={twClassnames(
                sections?.length - 1 === index ? "" : "mb-[9px]"
              )}
            >
              <Text
                style={{
                  fontFamily: "Inter",
                  fontStyle: "normal",
                  fontWeight: "500",
                  fontSize: 14,
                  color: activeSection === section.id ? "#000000" : "#929294",
                  height: 24,
                }}
              >
                {section.label}
              </Text>
            </Pressable>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
