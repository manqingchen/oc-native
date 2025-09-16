import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui';
import { MobileCommonBar } from '@/components/nav/mobile.common.bar';
import { BiometricAppSettings } from '@/components/biometric/BiometricAppSettings';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

export default function BiometricAppSettingsPage() {
  return (
    <GluestackUIProvider mode="light">
      <Box className="flex-1 bg-gray-50">
        <MobileCommonBar title="应用锁定设置" />
        <ScrollView className="flex-1">
          <BiometricAppSettings />
        </ScrollView>
      </Box>
    </GluestackUIProvider>
  );
}
