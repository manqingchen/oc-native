import { Tabs } from 'expo-router';
import { useAssets } from "@/hooks/useAsset";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#DEDEDE',
          borderTopWidth: 1,
          height: 60,
          paddingHorizontal: 55,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 5,
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#9B9B9B',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("nav.home"),
          tabBarIcon: ({ focused }) => {
            const IconComponent = focused ? activeHomeIcon : homeIcon;
            return <IconComponent />;
          },
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t("nav.products"),
          tabBarIcon: ({ focused }) => {
            const IconComponent = focused ? activeProductIcon : productIcon;
            return <IconComponent />;
          },
        }}
      />
      <Tabs.Screen
        name="assetsPage"
        options={{
          title: t("nav.assets"),
          tabBarIcon: ({ focused }) => {
            const IconComponent = focused ? activeAssetsIcon : assetsIcon;
            return <IconComponent />;
          },
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: t("nav.my"),
          tabBarIcon: ({ focused }) => {
            const IconComponent = focused ? activeMyIcon : myIcon;
            return <IconComponent />;
          },
        }}
      />
    </Tabs>
  );
}
