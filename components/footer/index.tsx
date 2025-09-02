import { useTranslation } from "react-i18next";
import { Box, Text } from "../ui";
import { ContactInformation } from "./contact.information";

export function Footer() {
  const { t } = useTranslation();
  return (
    <Box className="flex flex-col justify-center items-center min-h-[212px] w-full bg-white border-t border-[#D9D9D9]">
      <Text className="font-['inter'] font-bold text-base leading-6 text-right tracking-[0.2px] text-black">
        {t('nav.stay_connected')}
      </Text>
      <ContactInformation className="mt-5 mb-6" />
      <Text className="font-['inter'] font-normal text-[14px] leading-[20px] text-black opacity-40">
        © 2025 OnChain. All rights reserved.
      </Text>
    </Box>
  );
}
