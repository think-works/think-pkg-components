import { BaseTreeNode, Key } from "./types";

export const isSymbol = (key: unknown): key is symbol =>
  typeof key === "symbol";
//@ts-ignore
export const getKey = (func, node, index, parent?: string | number): Key => {
  let key = "";
  if (func) {
    key = func(node, index, parent);
  }
  if (!key) {
    if (node.key) {
      key = node.key;
    } else if (node.id) {
      key = node.id;
    } else if (parent) {
      key = `${parent}-${index}`;
    } else {
      key = index;
    }
  }
  return key;
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
  parentIds: Key[] = [],
  results: Key[] = [],
) => {
  if (!searchText) {
    return [];
  }
  for (let i = 0; i < steps.length; i++) {
    const { id, name, children } = steps[i];

    // 检查节点是否包含搜索文本
    if (name && name.toString().includes(searchText)) {
      results.push(...parentIds);
    }

    if (children && children.length > 0) {
      findParentIdsBySearchText(
        children,
        searchText,
        parentIds.concat(id),
        results,
      );
    }
  }

  return [...new Set(results)];
};
