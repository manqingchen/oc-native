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
import { useEffect } from "react";
import { HomeBar } from "@/components/home/home.bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useModal } from '@/hooks/modal.hook'
import { Pressable } from 'react-native'

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

            {/* 开发测试按钮 */}
            {__DEV__ && (
              <Box className="mx-4 mt-8 gap-3">
                <Button
                  onPress={() => router.push('/push-test')}
                  className="bg-blue-500"
                >
                  <ButtonText className="text-white">🔔 推送测试</ButtonText>
                </Button>
                <Button
                  onPress={() => router.push('/biometric-demo')}
                  className="bg-green-500"
                >
                  <ButtonText className="text-white">🔐 生物识别演示</ButtonText>
                </Button>
              </Box>
            )}

            <BottomLogo className="mt-[100px] mb-[143px]" />
          </Box>
          <Marquee />
        </LinearGradient>
        <Footer />
      </Box>
    </ScrollView >
  );
}
