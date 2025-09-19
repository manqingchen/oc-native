import { clearToken, useUserStore } from "@/api/request";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ArrowRightIcon } from "@/components/ui/icon";
import { Text } from '@/components/ui/text';
import { twClassnames } from "@/utils";
import { useTranslation } from "react-i18next";
import { ImageBackground, ScrollView } from "react-native";
import { usePhantomWallet } from '@/stores/phantomWalletStore'
import { ModalType } from "@/constants/modal";
import { useWalletActions, useWalletState } from '@/hooks/useWallet'
import { Footer } from "@/components/footer";
import { Marquee } from "@/components/marquee";
import { BottomLogo } from "@/components/home/bottom.logo";
import { ProductCard } from "@/components/product/product.card";
import { useProductList } from "@/hooks/useProducts";
import { useEffect, useState, useMemo } from "react";
import { HomeBar } from "@/components/home/home.bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useModal } from '@/hooks/modal.hook'
import { Pressable } from 'react-native'
import VideoLightbox from "@/components/video/VideoLightbox";

export default function Index() {
  const { t } = useTranslation();
  const { open } = useModal()
  const { wallet } = usePhantomWallet()
  const { connect, disconnect, signMessage, address } = wallet || {}

  const {
    productList,
    getProductList,

  } = useProductList({ limit: 100 });

  // 组件挂载时获取产品列表
  useEffect(() => {
    getProductList();
  }, []);
  const [openVideo, setOpenVideo] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoItems = useMemo(() => ([
    { uri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    { uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { uri: 'https://media.w3.org/2010/05/sintel/trailer.mp4' },
    { uri: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4' },
  ]), []);
  return (
    <ScrollView >
      <ImageBackground source={require('@/assets/images/h5-bg.png')} resizeMode="cover" >
        <Box >
          <Box className="h-[100vh]" >
            <HomeBar />
            <Box
              className={twClassnames(
                "mt-[62px] ml-4"
              )}
            >
              <Text
                className={twClassnames(
                  "text-[46.2462px] leading-[49px] font-bold text-black"
                )}
              >
                {t("home.title")}
              </Text>
              <Text
                className={twClassnames(
                  "mt-7 text-[16px] leading-[20px] font-medium text-[#747474] w-[245px]"
                )}
              >
                {t("home.sub-title")}
              </Text>
              <Button
                onPress={() => address ? router.push('/products') : open(ModalType.CONNECT_WALLET)}
                className={twClassnames(
                  "h-11 w-[160px] mt-6"
                )}
              >
                <ButtonText>
                  {t("button.get-started")}
                </ButtonText>
                <ButtonIcon size='md' as={ArrowRightIcon} className="ml-3" />
              </Button>
              <Pressable onPress={() => { setVideoIndex(0); setOpenVideo(true); }}
                className={twClassnames("mt-3 h-10 w-[160px] rounded bg-black items-center justify-center")}
              >
                <Text className="text-white">查看视频Demo</Text>
              </Pressable>

            </Box>
          </Box>
        </Box>
      </ImageBackground>
      <Box>
        <LinearGradient
          colors={["#FFD0C7", "#FFF7D9", "#EFEFEF"]}

          locations={[0.0769, 0.3381, 0.8611]}
          start={{ x: 0.5, y: 1 }} // 从底部中心开始
          end={{ x: 0.5, y: 0 }} // 向顶部中心扩散
        >
          <Box className={twClassnames("mt-8 px-4")}>
            <Text
              className={twClassnames(
                "text-[40px] leading-[60px] font-bold text-[#131F23] mb-[27px]"
              )}
            >
              {t("home.products")}
            </Text>

            <ScrollView
              showsHorizontalScrollIndicator={false}
            >
              <Box
                className={twClassnames(
                  "flex flex-col gap-[31px]"
                )}
              >
                {productList?.map((product) => (
                  <ProductCard key={product?.productId} product={product} />
                ))}
              </Box>
            </ScrollView>
            <Box
              className={twClassnames(
                "flex flex-row ", "gap-4 mt-[100px]"
              )}
            >
              {/* <Image source={homeDescription} alt={t("home.description")} /> */}
              <Text
                className={twClassnames(
                  "font-normal text-[21.0213px] leading-[38px] text-[#131F23]"
                )}
              >
                {t("home.description")}
              </Text>

            </Box>

          </Box>
          <Marquee />
        </LinearGradient>
        <Footer />
      </Box>
      <VideoLightbox isOpen={openVideo} onClose={() => setOpenVideo(false)} items={videoItems} initialIndex={videoIndex} />

    </ScrollView >
  );
}
