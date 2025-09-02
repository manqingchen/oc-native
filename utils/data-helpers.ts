/**
 * 数据处理工具函数
 */

// 安全获取嵌套对象属性
export const safeGet = <T>(obj: any, path: string, defaultValue: T): T => {
  try {
    const result = path.split('.').reduce((current, key) => current?.[key], obj);
    return result !== undefined ? result : defaultValue;
  } catch {
    return defaultValue;
  }
};

// 检查数组是否有效且非空
export const isValidArray = (arr: any): arr is any[] => {
  return Array.isArray(arr) && arr.length > 0;
};

// 检查对象是否有效且非空
export const isValidObject = (obj: any): boolean => {
  return obj !== null && obj !== undefined && typeof obj === 'object' && !Array.isArray(obj);
};

// 安全的数组映射，过滤掉无效项
export const safeMap = <T, R>(
  arr: T[] | undefined | null,
  mapFn: (item: T, index: number) => R,
  filterFn?: (item: T) => boolean
): R[] => {
  if (!isValidArray(arr)) return [];
  
  let result = arr;
  if (filterFn) {
    result = arr.filter(filterFn);
  }
  
  return result.map(mapFn);
};

// 根据语言获取本地化内容
export const getLocalizedContent = <T extends { language?: number }>(
  list: T[] | undefined,
  targetLanguage: number,
  fallbackLanguage = 0
): T | null => {
  if (!isValidArray(list)) return null;
  
  // 优先返回目标语言
  const targetItem = list.find(item => item?.language === targetLanguage);
  if (targetItem) return targetItem;
  
  // 回退到默认语言
  const fallbackItem = list.find(item => item?.language === fallbackLanguage);
  if (fallbackItem) return fallbackItem;
  
  // 最后返回第一个可用项
  return list[0] || null;
};