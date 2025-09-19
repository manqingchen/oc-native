import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, ListRenderItemInfo, Platform, Pressable, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { Box, Text } from '@/components/ui';
import { Video, ResizeMode, AVPlaybackStatusSuccess } from 'expo-av';

export type VideoItem = {
  uri?: string;        // 远程 URL
  module?: number;     // 本地 require('@/assets/...')
  posterUri?: string;
};

export interface VideoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: VideoItem[];
  initialIndex?: number;
}

const { width, height } = Dimensions.get('window');

export function VideoLightbox({ isOpen, onClose, items, initialIndex = 0 }: VideoLightboxProps) {
  const listRef = useRef<FlatList<VideoItem>>(null);
  const videoRefs = useRef<Record<number, Video | null>>({});
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsPlaying(false);
      // 滚动到初始位置
      requestAnimationFrame(() => {
        if (listRef.current) {
          try {
            listRef.current.scrollToIndex({ index: initialIndex, animated: false });
          } catch {}
        }
      });
    } else {
      // 关闭时暂停所有
      Object.values(videoRefs.current).forEach(v => v?.pauseAsync().catch(() => {}));
      setIsPlaying(false);
    }
  }, [isOpen, initialIndex]);

  const onScrollEnd = useCallback((e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== currentIndex) {
      // 暂停旧的
      videoRefs.current[currentIndex]?.pauseAsync().catch(() => {});
      setCurrentIndex(idx);
      setIsPlaying(false);
    }
  }, [currentIndex]);

  const togglePlay = useCallback(async () => {
    const player = videoRefs.current[currentIndex];
    if (!player) return;
    try {
      if (isPlaying) {
        await player.pauseAsync();
        setIsPlaying(false);
      } else {
        // Web 端通常需要用户交互后才允许播放；此处为点击触发
        await player.playAsync();
        setIsPlaying(true);
      }
    } catch {}
  }, [currentIndex, isPlaying]);

  const renderItem = useCallback(({ item, index }: ListRenderItemInfo<VideoItem>) => {
    const isCurrent = index === currentIndex;
    return (
      <View style={{ width, height }}>
        <Video
          ref={(ref) => { videoRefs.current[index] = ref; }}
          source={item.module ?? ({ uri: item.uri! } as any)}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          posterSource={item.posterUri ? { uri: item.posterUri } : undefined}
          usePoster={!!item.posterUri}
          shouldPlay={false}
          isMuted={false}
          useNativeControls={Platform.OS === 'web'}
          onError={(e) => console.warn('Video error', e)}
          onPlaybackStatusUpdate={(status) => {
            if (!isCurrent) return;
            const s = status as AVPlaybackStatusSuccess;
            if (s.isLoaded) {
              // 同步播放状态（避免外部状态不同步）
              if (typeof s.isPlaying === 'boolean' && s.isPlaying !== isPlaying) {
                setIsPlaying(s.isPlaying);
              }
            }
          }}
        />
      </View>
    );
  }, [currentIndex, isPlaying]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  }), []);

  const keyExtractor = useCallback((_, i: number) => `${i}`, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" className="web:pointer-events-auto">
      <ModalBackdrop onPress={onClose} />
      <ModalContent className="bg-transparent p-0 border-0 rounded-none w-full h-full">
        {/* 关闭按钮 */}
        <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
          <Text className="text-white text-xl">✕</Text>
        </Pressable>

        {/* 横向滑动切换 */}
        <FlatList
          ref={listRef}
          data={items}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialIndex}
          windowSize={2}
          maxToRenderPerBatch={2}
          removeClippedSubviews={Platform.OS !== 'web'}
        />

        {/* 播放/暂停按钮（居中覆盖）*/}
        <Pressable onPress={togglePlay} style={styles.playPauseBtn} hitSlop={12}>
          <Box className="rounded-full bg-black/50 px-4 py-2">
            <Text className="text-white text-base">{isPlaying ? '暂停' : '播放'}</Text>
          </Box>
        </Pressable>
      </ModalContent>
    </Modal>
  );
}

const styles = StyleSheet.create({
  video: {
    width,
    height,
    backgroundColor: 'black',
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 16,
    zIndex: 20,
  },
  playPauseBtn: {
    position: 'absolute',
    top: height / 2 - 24,
    left: width / 2 - 40,
    zIndex: 20,
  },
});

export default VideoLightbox;

