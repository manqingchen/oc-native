import { twClassnames } from "@/utils";
import { useTranslation } from "react-i18next";
import { Box, Text } from "@/components/ui";

export function AssetsInfo({
  label,
  value,
  unit = false,
  className = '',
}: {
  label: string;
  value: string;
  unit?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <Box style={{
      marginRight: 22
    }} className={twClassnames("flex flex-col gap-1", className)}>
      <Text className="text-[13.275px] leading-[16px] font-normal text-[#929294] font-['inter']">
        {label}
      </Text>
      <Text className="text-[13.275px] leading-[16px] font-semibold text-[#151517] font-['inter']">
        {value}
        <Text className="ml-0.5 font-['inter'] font-normal text-[8px] leading-[10px] text-black">
          {unit && t("product.detail.USDC")}
        </Text>
      </Text>
    </Box>
  );
}
