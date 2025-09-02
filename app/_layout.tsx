import '../pro'
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import { PrivyProvider } from "@privy-io/expo";
import { PrivyElements } from "@privy-io/expo/ui";
import { ModalType } from "@/constants/modal";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

// @ts-ignore
import { Box } from '@/components/ui/box';
import { StatusBar } from 'expo-status-bar';
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Layout } from "@/components/layout";
import { useModal } from '@/hooks/modal.hook';
import { useInit } from '@/hooks/useInit';
import { BaseModal } from '@/components/modal/base.modal';

export default function RootLayout() {
  const { isOpen, modalType, close } = useModal();
  useInit()
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // 获取屏幕尺寸
  const { height } = Dimensions.get('window');

  // 布局配置
  const layoutConfig = {
    scrollable: true,
    backgroundColor: 'transparent',
    fullScreenBackground: false,
    statusBarStyle: 'dark-content' as const,
    showDynamicIslandOverlay: true
  };

  // 样式定义
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundImage: {
      flex: 1,
      position: layoutConfig.fullScreenBackground ? 'absolute' : 'relative',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: layoutConfig.fullScreenBackground ? height : '100%',
    },
    dynamicIslandOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      zIndex: 1,
    },
    safeArea: {
      flex: 1,
      backgroundColor: layoutConfig.fullScreenBackground ? 'transparent' : layoutConfig.backgroundColor,
    },
    content: {
      flexGrow: 1,
    },
  });

  const ContentWrapper = layoutConfig.scrollable ? ScrollView : View;
  const contentWrapperProps = layoutConfig.scrollable ? {
    className: "flex-1",
    contentContainerStyle: {
      flexGrow: 1,
    },
    showsVerticalScrollIndicator: false
  } : {
    className: "flex-1"
  };
  return (
    <PrivyProvider
      appId={Constants.expoConfig?.extra?.privyAppId}
      clientId={Constants.expoConfig?.extra?.privyClientId}
    >
      <GluestackUIProvider mode="light">
        <RootSiblingParent>
          <Layout>
            <View style={styles.container}>
              {/* 状态栏设置 */}
              <StatusBar style="auto" />

              <SafeAreaView
                style={[
                  styles.safeArea,
                  { backgroundColor: layoutConfig.backgroundColor }
                ]}
                edges={layoutConfig.fullScreenBackground ? ['bottom', 'left', 'right'] : ['top', 'bottom', 'left', 'right']}
                className='bg-white'
              >
                <Box className="flex-1">
                  {/* 主要内容区域 */}
                  <ContentWrapper {...contentWrapperProps}>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                      <Stack.Screen name="productDetail" options={{ headerShown: false }} />
                      <Stack.Screen name="onchainDocs" options={{ headerShown: false }} />
                      <Stack.Screen name="system-message" options={{ headerShown: false }} />
                      <Stack.Screen name="trade" options={{ headerShown: false }} />
                      <Stack.Screen name="transaction" options={{ headerShown: false }} />
                      <Stack.Screen name="product-activities" options={{ headerShown: false }} />
                    </Stack>
                  </ContentWrapper>
                </Box>
              </SafeAreaView>
            </View>
            <BaseModal type={modalType} isOpen={isOpen} onClose={close} />
          </Layout>
        </RootSiblingParent>
      </GluestackUIProvider>
      <PrivyElements />
    </PrivyProvider>
  );
}
