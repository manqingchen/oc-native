import { OnchainDocSection } from "@/constants/oc.doc";
// import { useScrollStore } from "@/store/scorll.store";
import { twClassnames } from "@/utils";
import { usePathname, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useAssets } from '@/hooks/useAsset'
import { useTranslation } from "react-i18next";
import { GestureResponderEvent, Image, Pressable } from "react-native";
// import { Notices } from "../notices/notices";
// import { SettingPopover } from "../popvoer/setting.popover";
import { Box, Text } from "../ui";
import { WalletButton } from "../wallet/walletButton";
import { Notices } from "../notices/notices";
import { SettingPopover } from "../popvoer/setting.popover";
// import {
//   Popover,
//   PopoverBackdrop,
//   PopoverBody,
//   PopoverContent,
// } from "../ui/popover";
// import { WalletButton } from "../wallet/wallet.buttom";

export const MobileCommonBar = ({ title }: { title?: string }) => {
  const { commonBack: CommonBackIcon, setting } = useAssets();
  const router = useRouter();
  const pathname = usePathname();
  const isOcDocRoute = pathname === "/onchain-docs";
  const isMyRoute = pathname === "/my";
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const LeftButton = () => {
    if (isOcDocRoute) {
      // return <MenuPopover />;
    }
    if (isMyRoute) {
      return <Box />;
    }
    return (
      <Pressable onPress={handleBackPress}>
        <CommonBackIcon
          style={{ width: 28, height: 28 }}
        />
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
      {title ? (
        <Box className="flex-1">
          <Text className="font-['Inter'] font-semibold text-[18px] leading-[22px] text-black text-center opacity-90 shrink-0 flex-nowrap">
            {title}
          </Text>
        </Box>
      ) : (
        <Box className="flex flex-row items-center gap-2.5">
          <WalletButton />
          {isMyRoute && <SettingPopover />}
          <Notices />
        </Box>
      )}
      {title ? <Box className="w-10" /> : null}
    </Box>
  );
};

// export function MenuPopover({ children }: { children?: React.ReactNode }) {
//   const { menu, close } = useAssets();
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState("");
//   const { currentPlatform } = useCurrentDimensions();
//   const isInContent = useRef(false);
//   const pathname = usePathname();
//   const handlePress = (event: GestureResponderEvent) => {
//     if (pathname === "/onchain-docs") setIsOpen(true);
//   };
//   const { scrollToSection } = useScrollStore();

//   const handleSectionPress = (sectionId: string) => {
//     setActiveSection(sectionId);
//     scrollToSection(sectionId);
//     setIsOpen(false);
//   };
//   const { t } = useTranslation();

//   const sections = [
//     {
//       id: OnchainDocSection.ABOUT_ONCHAIN,
//       label: t("onchain-docs.about_onchain.title"),
//     },
//     {
//       id: OnchainDocSection.HOW_TO_START,
//       label: t("onchain-docs.how_to_start.title"),
//     },
//     {
//       id: OnchainDocSection.WALLET_GUIDE,
//       label: t("onchain-docs.wallet_guide.title"),
//     },
//     {
//       id: OnchainDocSection.TRADE_GUIDE,
//       label: t("onchain-docs.trade_guide.title"),
//     },
//     {
//       id: OnchainDocSection.TRUST_SECURITY,
//       label: t("onchain-docs.trust_security.title"),
//     },
//     {
//       id: OnchainDocSection.CONTACT_US,
//       label: t("onchain-docs.contact_us.title"),
//     },
//   ];

//   return (
//     <Popover
//       isOpen={isOpen}
//       onClose={() => setIsOpen(false)}
//       placement="bottom left"
//       trigger={(triggerProps) => (
//         <Pressable
//           {...triggerProps}
//           onPress={handlePress}
//           // onHoverIn={() => {
//           //   setIsOpen(true);
//           // }}
//           className="flex flex-row items-center gap-3"
//         >
//           {children ?? (
//             <>
//               <Image source={isOpen ? close : menu} alt="menu" />
//               <Text className="font-['Inter'] font-normal text-[14px] leading-[24px] text-black">
//                 menu
//               </Text>
//             </>
//           )}
//         </Pressable>
//       )}
//       offset={currentPlatform === "pc" ? 24 : 10}
//     >
//       <PopoverBackdrop />
//       <Pressable
//       // onHoverIn={() => {
//       //   isInContent.current = true;
//       //   setIsOpen(true);
//       // }}
//       // onHoverOut={() => {
//       //   // todo mock pc hover out
//       //   isInContent.current = false;
//       //   setTimeout(() => {
//       //     if (isInContent.current) return;
//       //     setIsOpen(false);
//       //   }, 300);
//       // }}
//       >
//         <PopoverContent
//           style={{
//             backgroundColor: "white",
//             borderWidth: 1,
//             borderColor: "black",
//             borderRadius: 20,
//             width: 208,
//             height: 229,
//           }}
//         >
//           <PopoverBody>
//             {sections.map((section, index) => (
//               <Pressable
//                 key={section.id}
//                 onPress={() => handleSectionPress(section.id)}
//                 className={twClassnames(
//                   sections?.length - 1 === index ? "" : "mb-[9px]"
//                 )}
//               >
//                 <Text
//                   style={{
//                     fontFamily: "Inter",
//                     fontStyle: "normal",
//                     fontWeight: "500",
//                     fontSize: 14,
//                     color: activeSection === section.id ? "#000000" : "#929294",
//                     height: 24,
//                   }}
//                 >
//                   {section.label}
//                 </Text>
//               </Pressable>
//             ))}
//           </PopoverBody>
//         </PopoverContent>
//       </Pressable>
//     </Popover>
//   );
// }
