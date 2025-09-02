import { chartDataOption } from "@/constants/chart.mock";
import { Dwm } from "@/constants/my.assest";
import { useMyAssetsStore } from "@/stores/my.assets.store";
import { formatChartLine } from "@/utils/chart.utils";
import { SkiaChart, SkiaRenderer } from "@wuba/react-native-echarts";
import { LineChart } from "echarts/charts";
import { GridComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { usePathname } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";

echarts.use([SkiaRenderer, LineChart, GridComponent]);

export function ProductLineOnlyChart({
  width: propWidth,
  height: propHeight,
  data
}: {
  width?: number;
  height?: number;
  data?: any
}) {
  const skiaRef = useRef<any>(null);
  const containerRef = useRef<View>(null);
  const [chartWidth, setChartWidth] = React.useState(0);


  const pathname = usePathname()
  let dwm = pathname === '/assets' ? useMyAssetsStore(state => state.dwm) : Dwm.day;
 const [chartData, setChartData] = useState<any>()


  useEffect(() => {
    let cData
    if (!data) cData = chartDataOption[dwm];
    else cData = formatChartLine(data, dwm)
    setChartData(cData)
  }, [data, pathname])
 
  const initChart = useCallback(
    (width: number) => {
      const option = {
        xAxis: {
          type: "category",
          data: chartData.x,
          show: false,
        },
        yAxis: {
          type: "value",
          show: false,
        },
        series: [
          {
            name: "黑线",
            data: chartData.black,
            type: "line",
            showSymbol: false,
            lineStyle: { color: "#000", width: 2 },
            itemStyle: { color: "#000" },
            areaStyle: undefined,
            smooth: true,
          },
        ],
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        tooltip: { show: false },
      };

      if (skiaRef.current) {
        const chart = echarts.init(skiaRef.current, "light", {
          renderer: "svg",
          width: width ? width : 77,
          height: 25,
        });
        chart?.setOption?.(option);
      }
    },
    [skiaRef, chartData, ]
  );

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
  }, [chartWidth, initChart, dwm]);

  return (
    <View
      ref={containerRef}
      style={{ width: propWidth ?? "100%", height: propHeight ?? 180 }}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setChartWidth(propWidth || width);
      }}
    >
      {chartWidth > 0 && <SkiaChart ref={skiaRef} />}
    </View>
  );
}
