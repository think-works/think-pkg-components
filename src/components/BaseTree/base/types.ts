import { ReactNode } from "react";

export type BaseTreeKey = string | number;

export interface BaseTreeNode {
  id: BaseTreeKey;
  name: number | string | boolean | ReactNode;
  parentId?: BaseTreeKey;
  children?: BaseTreeNode[];
  isLeaf?: boolean | ((val: BaseTreeNode) => boolean);
}

export interface BaseTreeIndexItem<T extends BaseTreeNode> {
  readonly key: BaseTreeKey;
  readonly node: T;
  readonly parent?: BaseTreeIndexItem<T>;
  readonly children: BaseTreeIndexItem<T>[];
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

export interface BaseTreeItemContext {
  hover: boolean;
}

export interface BaseTreeContextMenu<T extends BaseTreeNode> {
  label?: React.ReactNode;
  divider?: boolean;
  disabled?: boolean;
  onClick?: (node: T) => void | Promise<void>;
  subMenu?: BaseTreeContextMenu<T>[];
}

export type BaseTreeMenuActions<T extends BaseTreeNode = BaseTreeNode> =
  | BaseTreeContextMenu<T>[]
  | ((node: T) => BaseTreeContextMenu<T>[]);
