// import { MobileCommonBar } from "@/components/nav/mobile.common.bar";
import { MobileCommonBar } from '@/components/nav/mobile.common.bar';
import { ProductDetailMobileTrade } from '@/components/product/product.trade';
import { Box, Image, Text } from "@/components/ui";
import { useProductDetail } from '@/hooks/useProducts';
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useFofStore } from "@/stores/fof.store";
import { useMyAssetsStore } from "@/stores/my.assets.store";
import { formatNav, twClassnames } from "@/utils";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

type TypeProps = "subscribe" | "redeem"
export default function Trade() {
  const { id, type: typeParam } = useLocalSearchParams() as { id: string; type: TypeProps };
  // const { t } = useTranslation();
  const [type, setType] = useState<TypeProps>(typeParam || "subscribe");
  const dwm = useMyAssetsStore(s => s.dwm)

  const { productDetail, getProductDetail } = useProductDetail(id);

  useEffect(() => {
    getProductDetail({
      id,
      dwm
    })
  }, [id, dwm])
  if (!productDetail) return null
  return (
    <>
      <MobileCommonBar />
      <Box className="px-5">
        <Box className='mt-4'>
          <Box
            className={twClassnames("flex flex-row items-center gap-2.5 mb-6")}
          >
            <Link href={`/productDetail?id=${id}`}>
              <Box className="w-[57px] h-[57px] rounded-[10px]" >
                <Image source={{ uri: productDetail?.icon }} alt='' className="w-full h-full rounded-[10px] overflow-hidden" />
              </Box>
            </Link>
            <Box className="flex flex-col flex-1">

              <Box className="flex flex-row items-center justify-between w-full">
                <Link href={`/productDetail?id=${id}`}>
                  <Text className="text-[25.863px] leading-[31px] font-extrabold text-black font-['inter']">
                    {productDetail?.productName}
                  </Text>
                </Link>
                <Text className="text-[25.863px] leading-[31px] font-extrabold text-black font-['inter']">
                  ${formatNav(productDetail?.nav)}
                </Text>
              </Box>

              <Text className="font-['inter'] font-normal text-[13px] leading-[24px] text-[#929294]">
                {productDetail?.subtitle}
              </Text>
            </Box>
          </Box>
          <ProductDetailMobileTrade product={productDetail as Product.Detail} setType={setType} type={type} />
        </Box>
      </Box>
    </>
  );
}
