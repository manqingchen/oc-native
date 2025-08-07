import 'dotenv/config';

export default {
  expo: {
    name: "oc-native",
    slug: "oc-native",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      // 环境变量
      SOLANA_RPC_URL: process.env.SOLANA_RPC_URL,
      WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
      APP_NAME: process.env.APP_NAME,
      APP_VERSION: process.env.APP_VERSION,
      API_BASE_URL: process.env.API_BASE_URL,
      API_TIMEOUT: process.env.API_TIMEOUT,
      API_RETRY_COUNT: process.env.API_RETRY_COUNT,
      DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE,
      SUPPORTED_LANGUAGES: process.env.SUPPORTED_LANGUAGES,
      CHART_THEME: process.env.CHART_THEME,
      CHART_ANIMATION_DURATION: process.env.CHART_ANIMATION_DURATION,
      MMKV_ENCRYPTION_KEY: process.env.MMKV_ENCRYPTION_KEY,
      STORAGE_VERSION: process.env.STORAGE_VERSION,
      CACHE_EXPIRY_TIME: process.env.CACHE_EXPIRY_TIME,
      DEFAULT_THEME: process.env.DEFAULT_THEME,
      ENABLE_DARK_MODE: process.env.ENABLE_DARK_MODE,
      ANIMATION_DURATION: process.env.ANIMATION_DURATION,
      FONT_SCALE_FACTOR: process.env.FONT_SCALE_FACTOR,
    }
  }
};
