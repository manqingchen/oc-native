import { Image, Text, Box } from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";
import { useTranslation } from "react-i18next";

export function Empty() {
  const { t } = useTranslation()
  const { empty } = useAssets()
  return (
    <Box style={{
      // flexGrow: 1
    }} className="flex flex-col items-center justify-center h-full">
      <Image source={empty} style={{
        width: 174,
        height: 163
      }} />
      <Text className="font-['inter'] font-normal text-[12px] leading-[15px] text-[#7C7C7C]">{t('empty.title')}</Text>
    </Box>
  )
}
