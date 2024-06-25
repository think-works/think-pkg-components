import { BaseTreeKey, BaseTreeNode } from "./types";

/**
 * 根据路径从对象中判断值是否存在
 * @param obj
 * @param searchText
 * @param searchFilterProps
 * @returns boolean
 */
export const matchesSearch = (
  obj: Record<string, any>,
  searchText?: string,
  searchFilterProps: string[][] = [["name"]],
): boolean => {
  if (!searchText) {
    return false; // 如果没有提供搜索文本，返回 false
  }

  // 定义一个辅助函数，用于获取嵌套属性值
  const getNestedValue = (obj: Record<string, any>, path: string[]): any => {
    return path.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj,
    );
  };

  // 遍历搜索过滤字段数组
  for (const props of searchFilterProps) {
    const value = getNestedValue(obj, props);

    // 如果找到了值且值为字符串，进行匹配
    if (typeof value === "string" && value.toLowerCase().includes(searchText)) {
      return true;
    }
  }

  return false; // 如果所有字段都没有匹配，返回 false
};

/**
 * 根据 searchText 查找匹配的子节点并获取其所有父节点ID
 * @param steps
 * @param searchText
 * @param parentIds
 * @param results
 * @returns
 */
export const findParentIdsBySearchText = <T extends BaseTreeNode>(
  steps: T[],
  searchText?: string,
  searchFilterProps: string[][] = [["name"]],
  parentIds: BaseTreeKey[] = [],
  results: BaseTreeKey[] = [],
) => {
  if (!searchText) {
    return [];
  }
  for (let i = 0; i < steps.length; i++) {
    const { id, children } = steps[i];

    // 检查节点是否包含搜索文本
    if (matchesSearch(steps[i], searchText, searchFilterProps)) {
      results.push(...parentIds);
    }

    if (children && children.length > 0) {
      findParentIdsBySearchText(
        children,
        searchText,
        searchFilterProps,
        parentIds.concat(id),
        results,
      );
    }
  }

  return [...new Set(results)];
};
