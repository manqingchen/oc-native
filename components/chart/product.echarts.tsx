/* eslint-disable react-hooks/exhaustive-deps */
import { chartDataOption } from '@/constants/chart.mock';
import { useMyAssetsStore } from '@/stores/my.assets.store';
import { formatChartLine } from '@/utils/chart.utils';
import { SkiaChart, SkiaRenderer } from '@wuba/react-native-echarts';
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { usePathname } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

echarts.use([SkiaRenderer, LineChart, GridComponent]);

export function ProductTrendChart({ data, height }: { data?: any; height?: number }) {
  const skiaRef = useRef<any>(null);
  const containerRef = useRef<View>(null);
  const [chartWidth, setChartWidth] = React.useState(0);
  const [chartData, setChartData] = useState<any>()
  const dwm = useMyAssetsStore(state => state.dwm);
  const { t } = useTranslation()
  const pathname = usePathname()
  const tooltipTitleMap = {
    product: t('tooptip.assets'),
    assets: t('tooptip.values')
  }
  const tooltipTitle = pathname.includes('/assets') ? tooltipTitleMap['assets'] : tooltipTitleMap['product']

  useEffect(() => {
    let cData
    if (!data) cData = chartDataOption[dwm];
    else cData = formatChartLine(data, dwm)
    setChartData(cData)
  }, [data])

  const initChart = (width: number) => {
    const option = {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: chartData.x,
        axisLine: { lineStyle: { color: '#BDBDBD' } },
        axisLabel: {
          color: '#000',
          fontSize: 8,
          fontFamily: 'Urbanist',
          fontWeight: 400,
          lineHeight: 12,
          align: 'center',
          verticalAlign: 'middle',
        },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'category',
        data: chartData.y,
        position: 'right',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#E0E0E0', type: 'dashed' } },
        axisLabel: {
          color: '#000',
          fontSize: 8,
          fontFamily: 'Urbanist',
          fontWeight: 400,
          lineHeight: 12,
          align: 'center',
          verticalAlign: 'middle',
          margin: 10,
        },
      },
      series: [
        {
          name: '黑线',
          data: chartData.black,
          type: 'line',
          showSymbol: false,
          lineStyle: { color: '#000', width: 2 },
          itemStyle: { color: '#000' },
          areaStyle: undefined,
          smooth: true,
        },
      ],
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#000',
        borderRadius: 8,
        padding: [0, 6],
        textStyle: { color: '#fff', fontSize: 14, fontWeight: 700 },
        formatter: (params: any) => {
          const price = params[0]?.data ?? '';
          return `<Box style="text-align:center;">
            <Text style="font-family:'Inter';font-style:normal;font-weight:400;font-size:5.67469px;line-height:150%;display:flex;align-items:center;color:#FFFFFF;">${tooltipTitle}</Text>
            <Text style="font-family:'Inter';font-style:normal;font-weight:400;font-size:9.22136px;line-height:150%;display:flex;align-items:center;color:#FFFFFF;">${price}</Text>
          </Box>`;
        },
        // axisPointer: {
        //   type: 'cross',
        //   crossStyle: { color: '#000', type: 'dashed', width: 1 },
        //   lineStyle: { color: '#000', type: 'dashed', width: 1 },
        // },
      },
    };

    if (skiaRef.current) {
      const chart = echarts.init(skiaRef.current, 'light', {
        renderer: 'svg',
        width: chartWidth,
        height: 180,
      });
      chart.setOption(option);
    }
  };

  useEffect(() => {
    if (chartWidth > 0) {
      initChart(chartWidth);
    }

    return () => {
      if (skiaRef.current) {
        const chart = echarts?.getInstanceByDom?.(skiaRef?.current);
        if (chart) {
          chart.dispose();
        }
      }
    };
  }, [chartWidth]);



  return (
    <View
      ref={containerRef}
      style={{ width: '100%', height: 180 }}
      onLayout={(event) => {
        let { width } = event.nativeEvent.layout;
        width += 40
        setChartWidth(width);
      }}
    >
      {chartWidth > 0 && <SkiaChart ref={skiaRef} />}
    </View>
  );
}