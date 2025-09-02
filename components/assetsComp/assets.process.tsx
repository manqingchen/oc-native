import { useTranslation } from "react-i18next";
import { twClassnames } from "@/utils";
import { Box, Text } from "@/components/ui";

export function AssetsProcessTag({
  status,
}: {
  status: "processing" | "SEND_USER_SUCCESS" | string
}) {
  const { t } = useTranslation();
  const statusConfig: Record<string, { bgColor: string; color: string }> = {
    processing: {
      bgColor: "bg-[#C1C1C1]",
      color: "text-[#151517]",
    },
    send_user_success: {
      bgColor: "bg-[#FE5F00]",
      color: "text-white",
    },
  };

  const curStatus = statusConfig[status] ? "holding" : "processing"
  return (
    <Box
      className={twClassnames(
        "rounded-[10px] py-[1px] px-[14px] inline-flex",
        statusConfig[status]?.bgColor || statusConfig.processing.bgColor
      )}
    >
      <Text
        className={twClassnames(
          "font-['inter'] font-semibold text-[12.0896px] leading-[18px] whitespace-nowrap",
          statusConfig[status]?.color || statusConfig.processing.color
        )}
      >
        {t(`transaction.${curStatus}`)}
      </Text>
    </Box>
  );
}