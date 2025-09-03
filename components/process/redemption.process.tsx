import { Box, Image, Text } from "@/components/ui";
import { Language } from "@/constants/language";
import i18n from "@/messages/i18n";
import { useAssets } from "@/hooks/useAsset";
import { twClassnames } from "@/utils";

export const RedemptionProcess = ({
  currentStep = 1,
  process,
  textClassName = "",
}: {
  process?: MyAssets.AssetStatusList[];
  currentStep?: number;
  textClassName?: string;
}) => {
  const { inProcess: InProcessIcon, processDone: ProcessDoneIcon, processLine: ProcessLineIcon } = useAssets();

  const matchKey: "enState" | "cnState" = i18n.language === Language.EN ? 'enState' : 'cnState'
  if (!process) return null
  return (
    <Box className="h-[105px] w-full gap-[15px] flex flex-row relative mt-4">
       <Box className="absolute top-3 left-1.5 ">
        <ProcessLineIcon style={{
          height: 20
        }} />
      </Box>
      <Box className="gap-4 flex flex-col">
        {process?.map((item, index) => (
          <Box key={index} className="flex flex-row items-center">
            {index + 1 <= currentStep ? <ProcessDoneIcon /> : <InProcessIcon />}
            <Text className={twClassnames("ml-[11px] font-['inter'] font-normal text-[12px] leading-[15px] text-[#151517]", textClassName)}>
              {item[matchKey]}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
