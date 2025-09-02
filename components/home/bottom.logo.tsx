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
  const { homeDescription, homeOCText } = useAssets()
  return (
    <Box className={twClassnames("flex flex-col gap-2 justify-center items-center", className)}>
      <Image
        source={homeDescription}
        alt={t("home.description")}
        style={{ width: 118, height: 80 }}
      />
      <Image source={homeOCText} alt={"onchain"} />
    </Box>
  );
}
