import { Box, Text } from "@/components/ui";
import { Link } from "expo-router";
import React from "react";
import { Notices } from "../notices/notices";
import { WalletButton } from "../wallet/walletButton";
import { useAssets } from "@/hooks/useAsset";

export function MobileHomeBar() {
  const { logo: LogoIcon } = useAssets();
  return (
    <Box className="mx-5 flex flex-row items-center justify-between shrink-0  mt-3 mb-3">
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
