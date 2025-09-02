import React from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

interface RichTextContentProps {
  html: string;
  className?: string;
}

export function RichText({ html, className }: RichTextContentProps) {
  const { width } = useWindowDimensions();
  
  return (
    <RenderHtml
      contentWidth={width}
      source={{ html }}
      tagsStyles={{
        p: {
          // fontSize: isPC ? 16 : 12.5674,
          // lineHeight: isPC ? 24 : 19,
          // color: isPC ? '#929294' : '#6E6E6E',
          // fontFamily: 'Inter',
          margin: 0
        },
        // 其他标签样式...
      }}
      classesStyles={{
        'uai': {
          fontSize: 14,
          lineHeight: 17,
          fontWeight: 'normal',
          color: '#8F8F8F',
          fontFamily: 'Inter'
        },
        'uai-mobile': {
          fontSize: 10,
          lineHeight: 12,
          fontWeight: 'normal',
          color: '#8F8F8F',
          fontFamily: 'Inter'
        },
        'uai-home': {
          fontSize: 10.62,
          lineHeight: 13,
          marginBottom: 14,
          fontWeight: 'semibold',
          color: '#151517',
          fontFamily: 'Inter'
        }
      }}
    />
  );
}