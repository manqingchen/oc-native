/**
 * 图表相关类型定义
 */

import type { ChartType } from '../config/constants';

// 图表数据点
export interface ChartDataPoint {
  x: number | string | Date;
  y: number;
  label?: string;
  color?: string;
}

// 图表系列数据
export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: ChartType;
}

// 图表配置
export interface ChartConfig {
  type: ChartType;
  title?: string;
  subtitle?: string;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  animation?: boolean;
  animationDuration?: number;
  responsive?: boolean;
}

// 图表轴配置
export interface ChartAxis {
  title?: string;
  min?: number;
  max?: number;
  type?: 'linear' | 'logarithmic' | 'datetime' | 'category';
  labels?: {
    format?: string;
    rotation?: number;
    style?: object;
  };
  gridLines?: {
    show?: boolean;
    color?: string;
    width?: number;
  };
}

// 图表选项
export interface ChartOptions {
  chart: ChartConfig;
  xAxis?: ChartAxis;
  yAxis?: ChartAxis;
  legend?: {
    show?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'left' | 'center' | 'right';
  };
  tooltip?: {
    show?: boolean;
    format?: string;
    backgroundColor?: string;
    borderColor?: string;
  };
  colors?: string[];
  series: ChartSeries[];
}

// 价格数据
export interface PriceData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// K线图数据
export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// 图表主题
export interface ChartTheme {
  name: string;
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  colors: string[];
}

// 图表状态
export interface ChartState {
  isLoading: boolean;
  data: ChartSeries[];
  error: string | null;
  lastUpdated: number;
}

export type { ChartType };
