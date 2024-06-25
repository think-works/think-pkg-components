/**
 * 找下一个
 * @param arr 存储下标的数组
 * @param targetValue
 * @returns
 */
export const findNextIndex = (arr: number[], targetValue: number) => {
  const index = arr.indexOf(targetValue);

  if (index !== -1) {
    // 如果找到的下标是数组最后一位，则返回数组第一位的值，否则返回下一个下标的值
    return index === arr.length - 1 ? arr[0] : arr[index + 1];
  }

  // 如果未找到目标值，则返回 0
  return 0;
};

/**
 * 找上一个
 * @param arr
 * @param targetValue 存储下标的数组
 * @returns
 */
export const findLastIndex = (arr: number[], targetValue: number) => {
  const index = arr.indexOf(targetValue);

  if (index !== -1) {
    // 如果找到的下标是数组第一位，则返回数组最后一位的值，否则返回前一个下标的值
    return index === 0 ? arr[arr.length - 1] : arr[index - 1];
  }

  // 如果未找到目标值，则返回 0
  return 0;
};
