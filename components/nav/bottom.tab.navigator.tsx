import { Box, Text } from "@/components/ui/";
import { useAssets } from "@/hooks/useAsset";
import { twClassnames } from "@/utils";
import { Link, usePathname } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function BottomTabNavigator() {
  const pathname = usePathname();

  const { t } = useTranslation();
  const {
    productIcon,
    activeProductIcon,
    activeHomeIcon,
    homeIcon,
    activeAssetsIcon,
    assetsIcon,
    activeMyIcon,
    myIcon,
  } = useAssets();
  const bottomBarRef = useMemo(
    () =>
      [
        {
          href: "/",
          icon: pathname === "/" ? activeHomeIcon : homeIcon,
          text: t("nav.home"),
          isActive: pathname === "/",
        },
        {
          href: "/products",
          icon: pathname === "/products" ? activeProductIcon : productIcon,
          text: t("nav.products"),
          isActive: pathname === "/products",
        },
        {
          href: "/assetsPage",
          icon: pathname === "/assetsPage" ? activeAssetsIcon : assetsIcon,
          text: t("nav.assets"),
          isActive: pathname === "/assetsPage",
        },
        {
          href: "/my",
          icon: pathname === "/my" ? activeMyIcon : myIcon,
          text: t("nav.my"),
          isActive: pathname === "/my",
        },
      ] as const,
    [pathname, activeHomeIcon, homeIcon, t, activeProductIcon, productIcon, activeAssetsIcon, assetsIcon, activeMyIcon, myIcon]
  );
  const bottomRoutes = bottomBarRef.map((item) => item.href);
  if (!bottomRoutes.includes(pathname as any)) return null;
  return (
    <Box id="nav-bottom" className="flex-row justify-between items-center bg-white border-t border-[#DEDEDE] h-[60px] px-[55px] fixed bottom-0 left-0 right-0">
      {bottomBarRef.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          className="flex flex-col text-[10px] leading-[24px] h-full text-[#9B9B9B] font-medium"
        >
          <Box className="flex items-center justify-center h-full pt-3">
            <item.icon />
            <Text className={twClassnames(
              "h-[24px] font-normal text-[10px] leading-[24px] text-center mt-[5px]",
              item.isActive ? "text-black font-500" : "text-[#9B9B9B]"
            )}>
              {item.text}
            </Text>
          </Box>
        </Link>
      ))}
    </Box>
  );
}
