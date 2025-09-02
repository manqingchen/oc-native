import { Box } from "../ui";

import { twClassnames } from "@/utils";
import { Image } from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";

export function MobileBottomLogo({
  className,
}: {
  className?: string;
}) {
  const { homeOCText: HomeOcTextIcon } = useAssets()
  return (
    <Box className={twClassnames("flex flex-col gap-2 justify-center items-center relative z-20", className)}>
      {/* <HomeOcTextIcon /> */}
    </Box>
  );
}
