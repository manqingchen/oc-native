import { twClassnames } from "@/utils";
import React, { useEffect, useMemo, useState } from "react";
import { Image, LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Box, Text } from "../ui";
import { useAssets } from "@/hooks/useAsset";


type ScrollbarProps = {
  speed?: number; // px/s
  height?: number;
};

export const Marquee: React.FC<ScrollbarProps> = ({
  speed = 60, // px/s
  height = 40,
}) => {
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);
  const { marquee } = useAssets();

  const marqueeArr = useMemo(() => marquee, [marquee])
  // 计算动画时长
  const getDuration = () => {
    if (!contentWidth) return 10000;
    return (contentWidth / speed) * 1000;
  };

  // 动画循环逻辑
  useEffect(() => {
    if (contentWidth === 0 || containerWidth === 0) return;
    translateX.value = 0;
    translateX.value = withRepeat(
      withTiming(-contentWidth, {
        duration: getDuration(),
        easing: Easing.linear,
      }),
      -1,
      false,
      (finished) => {
        if (finished) {
          runOnJS(() => {
            translateX.value = 0;
          })();
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentWidth, containerWidth, speed, marqueeArr]);

  // 动画样式
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    flexDirection: "row",
  }));

  // 渲染内容
  const renderContent = () => (
    <View style={styles.row}>
      {marqueeArr?.map((Item, idx) => (
        <Box key={idx} style={styles.item}>
          <Text>
            <Item
              style={{ marginRight: 18.66 }}
            />
          </Text>
        </Box>
      ))}
    </View>
  );

  // 布局回调
  const onContentLayout = (e: LayoutChangeEvent) => {
    setContentWidth(e.nativeEvent.layout.width);
  };
  const onContainerLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  return (
    <View className={twClassnames("h-[30px]")} style={[styles.container, { height }]} onLayout={onContainerLayout}>
      <Animated.View
        style={[animatedStyle, { width: contentWidth * 3 }]}
      // 让内容宽度撑满，避免闪烁
      >
        <View style={styles.row} onLayout={onContentLayout}>
          {renderContent()}
        </View>
        <View style={styles.row}>{renderContent()}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  item: {
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});
