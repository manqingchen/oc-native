import { Text, View, Pressable } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
export default function Back() {
  const router = useRouter();
  useEffect(() => {
    if (router.canGoBack()) {
      console.log('back 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀===================>>>>>>>>>>>');
      router.back()
    } else {
      console.log('replace 🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ===================>>>>>>>>>>>');
      router.replace('/')
    }

  }, [])
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable onPress={() => {
      }}>
        <Text>Back</Text>
      </Pressable>
    </View>
  );
}
