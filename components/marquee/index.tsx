import React, { useEffect, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAssets } from "@/hooks/useAsset";
import { Image } from 'expo-image'; // 从 expo-image 导入

type MarqueeProps = {
  speed?: number; // 滚动速度 (px/s)
  height?: number;
};

export const Marquee: React.FC<MarqueeProps> = ({
  speed = 50,
  height = 40,
}) => {
  const translateX = useSharedValue(0);

  const { marquee } = useAssets()
  // 轮播图数据 - 可以是文本、图片或其他内容
  const marqueeItems = useMemo(() => marquee, []);

  // 计算总宽度
  const itemWidth = 140;
  const itemSpacing = 20;
  const totalWidth = marqueeItems.length * (itemWidth + itemSpacing);

  useEffect(() => {
    // 无缝循环：从0位置移动到-totalWidth位置
    const duration = (totalWidth / speed) * 1000;

    // 开始动画
    translateX.value = withRepeat(
      withTiming(-totalWidth, {
        duration: duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [totalWidth, speed, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderItem = (Item: any, index: number) => (
    <View key={index} style={styles.item}>
      {/* <Text style={styles.itemText}>{item.content}</Text> */}
      <Item height="100%" />
    </View>
  );

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* 渲染两组相同的内容以实现无缝循环 */}
        {marqueeItems.map(renderItem)}
        {marqueeItems.map((item, index) => renderItem(item, index + marqueeItems.length))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
    justifyContent: "center",
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    // width: 140,
    height: 40,
    borderRadius: 6,
    // marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexShrink: 0, // 防止项目被压缩
  },
  itemText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "500",
    textAlign: "center",
  },
});
