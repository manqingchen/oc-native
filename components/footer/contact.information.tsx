import { Box, Pressable } from "@/components/ui";
import { useAssets } from "@/hooks/useAsset";
import { twClassnames } from "@/utils";
import { useRef } from "react";
import { Linking } from "react-native";
export function ContactInformation({
  className,
}: {
  className?: string;
}) {
  const { wx, x,tgImage } = useAssets();

  const contact = useRef([
    {
      icon: tgImage,
      link: "https://t.me/BILL_ONCHAIN",
      alt: "tg",
    },
    {
      icon: x,
      link: "https://x.com/onchain_rwa?s=11",
      alt: "x",
    },
  ]);

  return (
    <Box className={twClassnames("gap-2.5 flex flex-row", className)}>
      {contact.current.map((item) => (
        <Pressable key={item.alt} onPress={() => Linking.openURL(item.link)}>
          <item.icon key={item.alt} className="w-[52px] h-[52px]" />
        </Pressable>
      ))}
    </Box>
  );
}
