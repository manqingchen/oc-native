import dayjs from "dayjs";
import { Dwm } from "./my.assest";

export const chartDataDay = {
  x: Array.from({ length: 30 }, (_, i) => dayjs().subtract(i, 'day').format('MM.DD')).reverse(),
  y: Array.from({ length: 30 }, (_, i) => (1 + i * 0.01).toFixed(2)),
  black: Array.from({ length: 30 }, (_, i) => (1 + i * 0.01).toFixed(2)),
};

export const chartDataWeek = {
  x: Array.from({ length: 30 }, (_, i) => dayjs().subtract(i, 'day').format('MM.DD')).reverse(),
  y: Array.from({ length: 30 }, (_, i) => (1 + i * 0.01).toFixed(2)),
  black: Array.from({ length: 30 }, (_, i) => (1 + i * 0.01).toFixed(2)), 
}

export const chartDataMonth = {
  x: Array.from({ length: 30 }, (_, i) => dayjs().subtract(i, 'day').format('MM.DD')).reverse(),
  y: Array.from({ length: 30 }, (_, i) => (1 + i * 0.01).toFixed(2)),
  black: Array.from({ length: 30 }, (_, i) => (1 + i * 0.01).toFixed(2)), 
}

export const chartDataOption = {
  [Dwm.day]: chartDataDay,
  [Dwm.week]: chartDataWeek,
  [Dwm.month]: chartDataMonth,
}