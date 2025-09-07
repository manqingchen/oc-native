/* eslint-disable react-hooks/exhaustive-deps */
import { chartDataOption } from '@/constants/chart.mock';
import { useMyAssetsStore } from '@/stores/my.assets.store';
import { formatChartLine } from '@/utils/chart.utils';
import { usePathname } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ECharts from 'react-native-echarts-pro';

export function ProductLineOnlyChart({ data, height }: { data?: any; height?: number }) {
  const chartRef = useRef<any>(null);
  const containerRef = useRef<View>(null);
  const [chartWidth, setChartWidth] = React.useState(0);
  const [chartData, setChartData] = useState<any>();
  const dwm = useMyAssetsStore(state => state.dwm);
  const { t } = useTranslation();
  const pathname = usePathname();

  const tooltipTitleMap = {
    product: t('tooptip.assets'),
    assets: t('tooptip.values')
  };
  const tooltipTitle = pathname.includes('/assets') ? tooltipTitleMap['assets'] : tooltipTitleMap['product'];

  useEffect(() => {
    let cData;
    if (!data) cData = chartDataOption[dwm];
    else cData = formatChartLine(data, dwm);
    setChartData(cData);
  }, [data, dwm]);
  // 计算Y轴的动态min和max值
  const getYAxisRange = () => {
    if (!chartData?.y) return { min: 10, max: 13 };

    // 过滤掉0值，只考虑有效数据的最小值和最大值
    const dataValues = chartData.y.filter((val: number) => val > 0);
    if (dataValues.length === 0) return { min: 10, max: 13 };

    const actualMin = Math.min(...dataValues);
    const actualMax = Math.max(...dataValues);
    const range = actualMax - actualMin;
    const padding = Math.max(range * 0.05, 0.001); // 减少padding到5%

    return {
      min: (actualMin - padding).toFixed(5),
      max: (actualMax + padding).toFixed(5)
    };
  };

  // 生成图表配置选项
  const getChartOption = () => {
    // 确保chartData存在
    if (!chartData || !chartData.x || !chartData.y) {
      console.warn('Chart data is not ready');
      return null;
    }

    console.log('chartData ===================>>>>>>>>>>> ', chartData);
    const yAxisRange = getYAxisRange();

    console.log('yAxisRange ===================>>>>>>>>>>> ', yAxisRange);

    console.log('chartData.x ===================>>>>>>>>>>> ', chartData.x);
    return {
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: chartData.x,
        show: false, // 隐藏X轴
      },
      yAxis: {
        type: 'value',
        min: yAxisRange.min,
        max: yAxisRange.max,
        show: false, // 隐藏Y轴
      },
      series: [
        {
          name: tooltipTitle,
          data: chartData.y,
          type: 'line',
          showSymbol: false,
          lineStyle: { color: '#000', width: 2 },
          itemStyle: { color: '#000' },
          areaStyle: undefined,
          smooth: true,
        },
      ],
      tooltip: {
        show: false, // 隐藏tooltip
      },
    };
  };

  const chartOption = getChartOption();

  return (
    <View
      ref={containerRef}
      style={{ width: '100%', height: height || 180 }}
      onLayout={(event) => {
        let { width } = event.nativeEvent.layout;
        width += 40;
        setChartWidth(width);
      }}
    >
      {chartWidth > 0 && chartOption && (
        <ECharts
          ref={chartRef}
          option={chartOption}
          backgroundColor="rgba(255, 255, 255, 0)"
          height={height || 180}
        />
      )}
    </View>
  );
}
