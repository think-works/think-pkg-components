import { TreeDataNode } from "antd";
import { Key } from "react";

/** 树节点字段名 */
export type FieldNames = Partial<typeof defaultFieldNames>;

/** 默认树节点字段名 */
export const defaultFieldNames = {
  key: "key",
  title: "title",
  children: "children",
};

/** 获取树节点字段值(保留原节点对象引用) */
export const getFieldValues = <T extends Record<string, any>>(
  node: T,
  fieldNames?: FieldNames,
) => {
  const fieldNameKey = fieldNames?.key || defaultFieldNames.key;
  const fieldNameTitle = fieldNames?.title || defaultFieldNames.title;
  const fieldNameChildren = fieldNames?.children || defaultFieldNames.children;

  const normalKey = node?.[fieldNameKey] as (typeof node)["key"];
  const normalTitle = node?.[fieldNameTitle] as (typeof node)["title"];
  const normalChildren = node?.[fieldNameChildren] as (typeof node)["children"];

  return {
    fieldNameKey,
    fieldNameTitle,
    fieldNameChildren,

    normalKey,
    normalTitle,
    normalChildren,
  };
};

/** 查找节点树(保留原节点对象引用) */
export const findTreeNodes = <T extends Record<string, any>>(
  nodes: T[],
  key: Key,
  fieldNames?: FieldNames,
):
  | undefined
  | {
      /** 节点对象 */
      node: T;
      /** 节点索引 */
      index: number;
      /** 节点的兄弟节点 */
      siblings: T[];
      /** 节点的查找路径匹配项 */
      matches: T[];
    } => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const { normalKey, normalChildren } = getFieldValues(node, fieldNames);

    if (normalKey === key) {
      return {
        node,
        index: i,
        siblings: nodes,
        matches: [node],
      };
    }

    if (normalChildren?.length) {
      const result = findTreeNodes(normalChildren as T[], key, fieldNames);
      if (result) {
        return {
          ...result,
          matches: [node, ...result.matches],
        };
      }
    }
  }
};

/** 获取平面化节点(保留原节点对象引用) */
export const getFlatNodes = <T extends Record<string, any>>(
  nodes: T[],
  fieldNames?: FieldNames,
) => {
  const list: T[] = [];

  nodes.forEach((node) => {
    const { normalChildren } = getFieldValues(node, fieldNames);

    list.push(node);

    if (normalChildren?.length) {
      const items = getFlatNodes(normalChildren as T[], fieldNames);
      list.push(...items);
    }
  });

  return list;
};

/** 获取标准化节点(生成新节点对象引用) */
export const getStandardNodes = <T extends Record<string, any>>(
  nodes: T[],
  fieldNames?: FieldNames,
) => {
  const list = nodes.map((node) => {
    const { normalKey, normalTitle, normalChildren } = getFieldValues(
      node,
      fieldNames,
    );

    const newNode: TreeDataNode = {
      ...node,
      key: normalKey,
      title: normalTitle,
    };

    if (normalChildren?.length) {
      newNode.children = getStandardNodes(normalChildren, fieldNames);
    } else if (normalChildren) {
      newNode.children = [];
    }

    return newNode;
  });

  return list;
};

/** 获取非标准化节点(生成新节点对象引用) */
export const getNonstandardNodes = <T extends Record<string, any>>(
  nodes: TreeDataNode[],
  fieldNames?: FieldNames,
) => {
  const list = nodes.map((node) => {
    const { fieldNameKey, fieldNameTitle, fieldNameChildren } = getFieldValues(
      node,
      fieldNames,
    );

    const newNode: Record<string, any> = {
      ...node,
      [fieldNameKey]: node.key,
      [fieldNameTitle]: node.title,
    };

    if (node.children?.length) {
      newNode[fieldNameChildren] = getNonstandardNodes(
        node.children,
        fieldNames,
      );
    } else if (node.children) {
      newNode[fieldNameChildren] = [];
    }

    return newNode as T;
  });

  return list;
};
