import { ReactNode } from "react";

export type Key = string | number;

export interface BaseTreeNode {
  id: Key;
  name: number | string | boolean | ReactNode;
  parentId?: Key;
  children?: BaseTreeNode[];
  isLeaf?: boolean | ((val: BaseTreeNode) => boolean);
}

export interface TreeIndexItem<T extends BaseTreeNode> {
  readonly key: Key;
  readonly node: T;
  readonly parent?: TreeIndexItem<T>;
  readonly children: TreeIndexItem<T>[];
  readonly deep: number;
  readonly indeterminate: boolean;
  readonly isShow: boolean;
  /** 控制选择 会刷新树 */
  checked: boolean;
  /** 控制展开 会刷新树 */
  expanded: boolean | null;
  disabled: boolean;
  /** 节点被搜索到 */
  searched: boolean;
}

export interface TreeItemContext {
  hover: boolean;
}

export interface TreeContextMenu<T extends BaseTreeNode> {
  label?: React.ReactNode;
  divider?: boolean;
  disabled?: boolean;
  onClick?: (node: T) => void | Promise<void>;
  subMenu?: TreeContextMenu<T>[];
}

export type TreeMenuActions<T extends BaseTreeNode = BaseTreeNode> =
  | TreeContextMenu<T>[]
  | ((node: T) => TreeContextMenu<T>[]);
