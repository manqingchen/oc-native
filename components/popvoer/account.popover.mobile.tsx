import { formatWalletAddress, twClassnames } from "@/utils";
import React from "react";
import { Image, Pressable, Text } from "../ui";
import { router } from "expo-router";
import { usePhantomWallet } from "@/stores/phantomWalletStore";
import { supportWallets } from "@/lib/config";

export function AccountPopover() {
  const { wallet, setWallet } = usePhantomWallet()

  return (<Pressable onPress={() => {
    router.push("/my");
  }} className={twClassnames("flex flex-row items-center gap-1 pl-6 pr-[38px] h-[32px] bg-black rounded-[49px]", "pl-[5px] pr-[17px] h-8")}>
    <Image
      source={supportWallets.icon}
      size="none"
      className="w-4 h-4 ml-2"
      resizeMode="contain"
    />
    <Text className="font-inter text-[14px] leading-[24px] font-medium text-white">
      {formatWalletAddress(wallet.address ?? "")}
    </Text>
  </Pressable>)
}
