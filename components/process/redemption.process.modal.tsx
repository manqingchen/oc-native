import { Box, Image, Text } from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";
import { twClassnames } from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const RedemptionProcessModal = ({
  currentStep = 1,
  textClassName = "",
}: {
  currentStep?: number;
  textClassName?: string;
}) => {
  const { inProcess: InProcessIcon, processDone: ProcessDoneIcon, processLine: ProcessLineIcon } = useAssets();
  const { t } = useTranslation();
  const process = useMemo(
    () => [
      {
        title: t("assets.initiate_a_redeemption"),
      },
      {
        title: t("assets.asset_transaction_is_in_progress"),
      },
      {
        title: t("assets.transaction_completed"),
      },
      {
        title: t("assets.token_issuance"),
      },
    ],
    [t]
  );
  return (
    <Box className=" w-full gap-[15px] relative flex flex-row">
      <Box className="absolute top-[15px] left-1.5 ">
        <ProcessLineIcon style={{
          height: 20
        }} />
      </Box>
      <Box className="gap-4 flex flex-col">
        {process?.map((item, index) => (
          <Box key={index} className="flex flex-row items-center">
            {index + 1 <= currentStep ? <ProcessDoneIcon /> : <InProcessIcon />}
            <Text className={twClassnames("ml-[11px] font-['inter'] font-normal text-[12px] leading-[15px] text-[#151517]", textClassName)}>
              {item.title}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
