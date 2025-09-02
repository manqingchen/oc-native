import AsyncStorage from "@react-native-async-storage/async-storage";
import classnames from "classnames";
import { twMerge } from "tailwind-merge";

/**
 * 用户说 ： 格式化用户名
 * @param username 用户名
 * @returns 格式化后的用户名
 */
export const formatUsername = (username: string) => {
  if (!username) return "";
  if (username?.length <= 4) return username;

  return `${username.substring(0, 3)}...${username.charAt(
    username?.length - 1
  )}`;
};

/**
 * 格式化用户ID，保留前5位和后3位
 * @param userId 用户ID
 * @returns 格式化后的用户ID
 */
export const formatUserId = (userId: string | undefined, prefixLength = 3, suffixLength = 5) => {
  if (!userId) return "";
  if (userId?.length <= 8) return userId;

  return `${userId.substring(0, prefixLength)}....${userId.substring(userId?.length - suffixLength)}`;
};

export const twClassnames = (...args: any) => twMerge(classnames(...args));


export function formatWalletAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// 设置storage
export const setStorage = (key: string, value: any) => {
  // 检查环境
  if (typeof window !== 'undefined') {
    // 浏览器环境
    if (typeof localStorage !== 'undefined') {
      // Web环境使用localStorage
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      // React Native环境使用AsyncStorage
      AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } else {
    // 服务器端环境，可以使用内存存储或其他方式
    console.log('Server environment, storage operation skipped');
  }
}

// 获取storage
export const getStorage = async (key: string) => {
  try {
    // 检查环境
    if (typeof window !== 'undefined') {
      // 浏览器环境
      if (typeof localStorage !== 'undefined') {
        // Web环境使用localStorage
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } else {
        // React Native环境使用AsyncStorage
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      }
    } else {
      // 服务器端环境，返回默认值
      console.log('Server environment, returning default value');
      return null;
    }
  } catch (e) {
    console.error('Error getting storage:', e);
    return null;
  }
}

export function formatAmount(amount?: number | string) {
  if (!amount) return '0';
  amount = String(amount)
  // 转换为数字类型并处理非数字情况
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';

  // 处理极小值
  if (num > 0 && num < 0.0001) return '0.0001';

  // 处理零值
  if (num === 0) return '0.00';

  // 处理整数（没有小数部分）
  if (Number.isInteger(num)) return num.toFixed(2)

  // 处理有小数的情况
  const str = num.toString();
  if (str.includes('.')) {
    const parts = str.split('.');
    const decimalPart = parts[1];

    // 计算有效小数位数（去除末尾零）
    let significantDigits = decimalPart.replace(/0+$/, '').length > 2 ? 2 : decimalPart.replace(/0+$/, '').length;

    // 确保至少保留两位小数
    if (significantDigits < 2) significantDigits = 2;

    return num.toFixed(significantDigits).replace(/\.?0+$/, '');
  }

  // 默认返回两位小数
  return num.toFixed(2);
}


export function formatNav(amount?: number | string) {
  if (!amount) return '0';
  amount = String(amount)
  // 转换为数字类型并处理非数字情况
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';

  // 处理极小值
  if (num > 0 && num < 0.0001) return '0.0001';

  // 处理零值
  if (num === 0) return '0.00';

  // 处理整数（没有小数部分）
  if (Number.isInteger(num)) return num.toFixed(2)

  // 处理有小数的情况
  const str = num.toString();
  if (str.includes('.')) {
    const parts = str.split('.');
    const decimalPart = parts[1];

    // 计算有效小数位数（去除末尾零）
    let significantDigits = decimalPart.replace(/0+$/, '').length > 4 ? 4 : decimalPart.replace(/0+$/, '').length;

    // 确保至少保留两位小数
    if (significantDigits < 4) significantDigits = 4;

    return num.toFixed(significantDigits).replace(/\.?0+$/, '');
  }

  // 默认返回两位小数
  return num.toFixed(4);
}