import { ItemType } from "antd/es/menu/hooks/useItems";
import { BaseTreeNode } from "@/components/Tree";

export interface DirectoryNode<T extends BaseTreeNode, NODE_TYPE>
  extends BaseTreeNode {
  id: string;
  name: string;
  type: NODE_TYPE;
  priority?: number;
  parentId?: string;
  children?: DirectoryNode<T, NODE_TYPE>[];
  /** 节点颜色 */
  color?: string;
  /** 原始数据 */
  rawData?: T;
  /** 临时节点 */
  temp?: boolean;
}

export interface TreeActions<T> {
  rename?: (node: T) => Promise<void>;
  copy?: (node: T) => Promise<void>;
  delete?: (node: T) => Promise<void>;
  create?: (node: T) => Promise<void>;
  import?: (node: T) => Promise<void>;
}

type ACTION_TYPE = "rename" | "copy" | "delete" | "create" | "import";

export type BaseTreeAction<T extends BaseTreeNode, NODE_TYPE> = ItemType & {
  /**
   * key 保持列表唯一
   */
  key: string;
  /**
   * 内置操作类型，不填直接触发 onClick。填了就自动触发 TreeActions 中操作
   */
  actionType?: ACTION_TYPE;
  /**
   * 填了就有提示
   */
  tooltip?: string;
  /**
   * 填了就有二次确认，确定按钮触发 onClick
   */
  popConfirm?: string;
  onClick?: (node: DirectoryNode<T, NODE_TYPE>) => void;
};

export type CreateAction<T extends BaseTreeNode, NODE_TYPE> = BaseTreeAction<
  T,
  NODE_TYPE
> & {
  actionType: "create";
  /**
   * 新建的节点类型
   */
  createNodeType: NODE_TYPE;
  /**
   * 新建节点的默认填充名称
   */
  createDefaultName: string;
};

export type NonCreateAction<T extends BaseTreeNode, NODE_TYPE> = BaseTreeAction<
  T,
  NODE_TYPE
> & {
  actionType?: Exclude<ACTION_TYPE, "create">;
};
/**
 * 填了 actionType，会触发内置行为
 * 通过 actions 通知出去
 * 对应 "rename" | "copy" | "delete" | "create" | "import";
 */
export type DropdownItem<T extends BaseTreeNode, NODE_TYPE> =
  | CreateAction<T, NODE_TYPE>
  | NonCreateAction<T, NODE_TYPE>;
