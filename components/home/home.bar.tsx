import { Box } from "@/components/ui";
import { Link } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { useAssets } from "@/hooks/useAsset";
import { WalletButton } from "../wallet/walletButton";
import { Notices } from "../notices/notices";

export function HomeBar() {
  const { logo: LogoIcon } = useAssets();
  return (
    <Box className="mx-5 flex flex-row items-center justify-between shrink-0 h-10 mt-3">
      <Link href='/'>
        <LogoIcon />
      </Link>
      <Box className="flex flex-row items-center gap-2.5">
        <WalletButton />
        <Notices />
      </Box>
    </Box>
  );
}
