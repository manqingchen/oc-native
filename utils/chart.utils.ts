import { Dwm } from "@/constants/my.assest";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

// 日期格式化策略
const dateFormatters = {
  [Dwm.day]: (dateStr: string) => dayjs(dateStr).format('MM.DD'),
  [Dwm.week]: (dateStr: string) => {
    const weekNumber = dayjs(dateStr).isoWeek();
    return `${weekNumber} week`;
  },
  [Dwm.month]: (dateStr: string) => dayjs(dateStr).format('YYYY.MM'),
};

// 日期生成策略
const dateGenerators = {
  [Dwm.day]: (endDate: dayjs.Dayjs, i: number) => endDate.subtract(i, 'day'),
  [Dwm.week]: (endDate: dayjs.Dayjs, i: number) => endDate.subtract(i * 7, 'day').startOf('week'),
  [Dwm.month]: (endDate: dayjs.Dayjs, i: number) => endDate.subtract(i, 'month').startOf('month'),
};

// 数据处理策略
const dataProcessors = {
  [Dwm.week]: (item: MyAssets.IUserAsset) => {
    const yearWeek = item.assetDay;
    const year = parseInt(yearWeek.substring(0, 4));
    const week = parseInt(yearWeek.substring(4));
    const weekStart = dayjs().year(year).week(week).startOf('week');
    return { asset: item.asset, date: weekStart.format('YYYY-MM-DD') };
  },
  [Dwm.month]: (item: MyAssets.IUserAsset) => ({
    asset: item.asset,
    date: `${item.assetDay}-01`
  }),
  [Dwm.day]: (item: MyAssets.IUserAsset) => ({
    asset: item.asset,
    date: item.assetDay
  }),
};

const DATE_COUNTS = {
  [Dwm.day]: 30,
  [Dwm.week]: 8,
  [Dwm.month]: 6,
};

export const formatChartLine = (data: MyAssets.IUserAsset[], dwm: Dwm) => {
  const generateDateRange = (dwm: Dwm) => {
    const dates: string[] = [];
    const count = DATE_COUNTS[dwm] || 30;
    const endDate = dayjs();
    const generator = dateGenerators[dwm] || dateGenerators[Dwm.day];

    for (let i = count - 1; i >= 0; i--) {
      const date = generator(endDate, i);
      dates.push(date.format('YYYY-MM-DD'));
    }
    
    return dates;
  };

  const formatDate = (dateStr: string) => {
    const formatter = dateFormatters[dwm] || dateFormatters[Dwm.day];
    return formatter(dateStr);
  };

  const fullDateRange = generateDateRange(dwm);

  // 处理空数据
  if (!data || data.length === 0) {
    return {
      x: fullDateRange.map(formatDate),
      y: new Array(fullDateRange.length).fill(0)
    };
  }

  // 处理数据
  const processor = dataProcessors[dwm] || dataProcessors[Dwm.day];
  const processedData = data.map(processor);

  // 排序并创建映射
  const sortedData = processedData.sort((a, b) => 
    dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
  );

  const dataMap = new Map(sortedData.map(item => [item.date, item.asset]));
  
  return {
    x: fullDateRange.map(formatDate),
    y: fullDateRange.map(dateStr => dataMap.get(dateStr) || 0)
  };
};


export const formatProductChartLine = (data: Product.NavList[]) => {
  return data?.map(i => ({
   assetDay:i.navDay,
   asset: i.nav 
  }))
}