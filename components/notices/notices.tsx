import { useUserStore } from "@/api/request";
import { twClassnames } from "@/utils";
import React from "react";
import { Image, Pressable } from "@/components/ui";
import {
  Box
} from "../ui";
import { router, usePathname } from "expo-router";
import { useAssets } from "@/hooks/useAsset";
import { usePhantomWallet } from "@/stores/phantomWalletStore";
import { useSystemMessage } from "@/hooks/system.hook";

export function Notices() {
  const { notice } = useAssets();
  const {wallet} = usePhantomWallet()
  const { hasNoRead, isLoading } = useSystemMessage()
  const token = useUserStore(s => s.token)
  const pathname = usePathname()
  const inHome = pathname === '/'
  const NoticeIcon = notice
  return (
    <Pressable onPress={() => {
      if (!wallet.address || !token) return
      router.push("/system-message")
    }}>
      <Box className="relative ml-5px">
        <NoticeIcon />
        {hasNoRead && !isLoading ? (
          <Box className="absolute top-[5px] right-[6px] w-2 h-2 bg-[#EB001B] rounded-full" />
        ) : null}
      </Box>
    </Pressable>
  );
}
