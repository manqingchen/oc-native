import { useTranslation } from "react-i18next";
import { Box } from "../ui";

import { twClassnames } from "@/utils";
import { Image } from "react-native";
import { useAssets } from "@/hooks/useAsset";

export function BottomLogo({
  className,
}: {
  className?: string;
}) {
  const { t } = useTranslation();
  const { homeDescription: HomeDescriptionIcon, homeOCText: HomeOCTextIcon } = useAssets()
  return (
    <Box className={twClassnames("flex flex-col gap-2 justify-center items-center", className)}>
      <HomeDescriptionIcon />
      <HomeOCTextIcon />
    </Box>
  );
}
