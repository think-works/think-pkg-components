import { ItemType } from "antd/es/menu/interface";
import { BaseTreeNode } from "../BaseTree";
import { DropdownActionItem } from "../DropdownActions";

export interface DirectoryTreeNode<T extends BaseTreeNode, NODE_TYPE>
  extends BaseTreeNode {
  /**
   * 节点id
   */
  id: string;
  /**
   * 节点名字
   */
  name: string;
  /**
   * 节点类型
   */
  type: NODE_TYPE;
  /**
   * 节点父级id
   */
  parentId?: string;
  children?: DirectoryTreeNode<T, NODE_TYPE>[];
  /** 节点颜色 */
  color?: string;
  /** 原始数据 */
  rawData?: T;
  /** 临时节点 */
  temp?: boolean;
}

export interface DirectoryTreeActions<T> {
  rename?: (node: T) => Promise<void>;
  copy?: (node: T) => Promise<void>;
  delete?: (node: T) => Promise<void>;
  create?: (node: T) => Promise<void>;
  import?: (node: T) => Promise<void>;
}
/**
 * 内置的操作类型
 */
type ACTION_TYPE = "rename" | "copy" | "delete" | "create" | "import";

/**
 * 操作菜单项
 */
export type DirectoryTreeBaseTreeAction<
  T extends BaseTreeNode,
  NODE_TYPE,
> = ItemType & {
  /**
   * key 保持列表唯一
   */
  key: string;
  /**
   * 内置操作类型，不填直接触发 onClick。填了就自动触发 DirectoryTreeTreeActions 中操作
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
  onClick?: (node: DirectoryTreeNode<T, NODE_TYPE>) => void;
};
/**
 * 内置创建
 */
export type DirectoryTreeCreateAction<
  T extends BaseTreeNode,
  NODE_TYPE,
> = DropdownActionItem & {
  actionType: "create";
  /**
   * 新建的节点类型
   */
  createNodeType: NODE_TYPE;
  /**
   * 新建节点的额外属性
   */
  createRawData?: Record<string, any>;
  /**
   * 新建节点的默认填充名称
   */
  createDefaultName: string;
  onClick?: (node: DirectoryTreeNode<T, NODE_TYPE>) => void;
};
/**
 * 内置 "rename" | "copy" | "delete"  | "import";
 */
export type DirectoryTreeNonCreateAction<
  T extends BaseTreeNode,
  NODE_TYPE,
> = DropdownActionItem & {
  actionType?: Exclude<ACTION_TYPE, "create">;
  onClick?: (node: DirectoryTreeNode<T, NODE_TYPE>) => void;
};
/**
 * 填了 actionType，会触发内置行为
 * 通过 actions 通知出去
 * 对应 "rename" | "copy" | "delete" | "create" | "import";
 */
export type DirectoryTreeDropdownItem<T extends BaseTreeNode, NODE_TYPE> =
  | DirectoryTreeCreateAction<T, NODE_TYPE>
  | DirectoryTreeNonCreateAction<T, NODE_TYPE>;
