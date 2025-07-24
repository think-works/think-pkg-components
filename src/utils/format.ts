import { isType, msecToString } from "./tools";

const isNumber = (val: any) => isType<number>(val, "Number");

/**
 * 年级精确度 的格式化字符串
 */
export const yearFormatString = "YYYY";

/**
 * 月级精确度 的格式化字符串
 */
export const monthFormatString = "YYYY-MM";

/**
 * 日级精确度 的格式化字符串
 */
export const dayFormatString = "YYYY-MM-DD";

/**
 * 小时级精确度 的格式化字符串
 */
export const hourFormatString = "YYYY-MM-DD HH";

/**
 * 分钟级精确度 的格式化字符串
 */
export const minuteFormatString = "YYYY-MM-DD HH:mm";

/**
 * 秒级精确度 的格式化字符串
 */
export const secondFormatString = "YYYY-MM-DD HH:mm:ss";

/**
 * 毫秒级精确度 的格式化字符串
 */
export const millisecondFormatString = "YYYY-MM-DD HH:mm:ss.SSS";

/** 格式化时间 */
export const formatDatetime = (
  millisecond?: number,
  formatString: string = millisecondFormatString,
  placeholder: any = "-",
) => {
  if (!isNumber(millisecond)) {
    return placeholder;
  }

  return msecToString(millisecond, formatString);
};

/**
 * 格式化时间(毫秒级精确度)
 */
export const formatMillisecond = (millisecond?: number, placeholder?: any) =>
  formatDatetime(millisecond, millisecondFormatString, placeholder);

/**
 * 格式化时间(秒级精确度)
 */
export const formatSecond = (millisecond?: number, placeholder?: any) =>
  formatDatetime(millisecond, secondFormatString, placeholder);

/**
 * 格式化时间(分钟级精确度)
 */
export const formatMinute = (millisecond?: number, placeholder?: any) =>
  formatDatetime(millisecond, minuteFormatString, placeholder);

/**
 * 格式化时间(小时级精确度)
 */
export const formatHour = (millisecond?: number, placeholder?: any) =>
  formatDatetime(millisecond, hourFormatString, placeholder);

/**
 * 格式化时间(日级精确度)
 */
export const formatDay = (millisecond?: number, placeholder?: any) =>
  formatDatetime(millisecond, dayFormatString, placeholder);

/**
 * 格式化时间(月级精确度)
 */
export const formatMonth = (millisecond?: number, placeholder?: any) =>
  formatDatetime(millisecond, monthFormatString, placeholder);

/**
 * 格式化时间(年级精确度)
 */
export const formatYear = (millisecond?: number, placeholder?: any) =>
  formatDatetime(millisecond, yearFormatString, placeholder);
