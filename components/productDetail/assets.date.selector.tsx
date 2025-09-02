import { Dwm } from "@/constants/my.assest";
import { twClassnames } from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Box, Pressable, Text } from "../ui";
import { useMyAssetsStore } from "@/stores/my.assets.store";

export function AssetsDateSelector() {
  const { dwm, setDwm } = useMyAssetsStore();

  const { t } = useTranslation()
  const map = useMemo(() => [
    {
      label: Dwm.day,
      value: Dwm.day
    },
    {
      label: Dwm.week,
      value: Dwm.week
    },
    {
      label: Dwm.month,
      value: Dwm.month
    }
  ], [])
  return (
    <Box className="flex flex-row gap-[25px]">
      {
        map.map((item) => (
          <Pressable
            key={item.value}
            className={twClassnames(
              "flex flex-row items-center px-2 py-1 rounded-[35px] h-[24px]",
              dwm === item.value ? "bg-black" : "bg-transparent",
              "p-1"
            )}
            onPress={() => setDwm(item.value)}
          >
            <Text
              className={twClassnames(
                "text-[14.2305px] text-center",
                dwm === item.value
                  ? "text-white font-[600] font-['PingFang SC']"
                  : "text-[#414141] font-[400] font-['PingFang SC']"
              )}
            >
              {t(`dwm.${item.label}`)}
            </Text>
          </Pressable>
        ))
      }
    </Box>
  )
}