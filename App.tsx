import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { WalletDemoScreen } from './src/screens/WalletDemoScreen';

// 导入 WalletConnect 兼容性补丁 (暂时注释掉，避免 Hook 错误)
// import '@walletconnect/react-native-compat';

export default function App() {
  return (
    <>
      <WalletDemoScreen />
      <StatusBar style="auto" />
    </>
  );
}
