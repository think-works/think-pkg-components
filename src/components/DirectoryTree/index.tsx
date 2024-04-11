import cls from "classnames";
import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  BaseTree,
  TreeIndexItem,
  TreeItemContext,
  TreeProps,
  TreeRef,
} from "@/components/Tree";
import { BaseTreeNode, Key } from "@/components/Tree/base/types";
import styles from "./index.module.less";
import XDirectoryNode from "./node";
import { DirectoryNode, DropdownItem, TreeActions } from "./types";

export type { DirectoryNode, TreeRef, Key };

export interface DirectoryTreeProps<BASE_NODE extends BaseTreeNode, NODE_TYPE>
  extends TreeProps<DirectoryNode<BASE_NODE, NODE_TYPE>> {
  classNames?: string;
  style?: React.CSSProperties;
  /** actions call */
  actions?: TreeActions<DirectoryNode<BASE_NODE, NODE_TYPE>>;
  /** 允许添加的节点类型 枚举 NODE_TYPE */
  createTypes?: NODE_TYPE[];
  /** 显示个数 */
  showNodeCount?: boolean;
  /**
   * 文件夹 icon 内置
   * 这里自定义的是 非文件夹 图标
   * @param node
   * @returns
   */
  renderNodeIcon?: (
    node: DirectoryNode<BASE_NODE, NODE_TYPE>,
  ) => React.ReactNode;
  renderTag?: (node: DirectoryNode<BASE_NODE, NODE_TYPE>) => React.ReactNode;
  renderRight?: (node: DirectoryNode<BASE_NODE, NODE_TYPE>) => React.ReactNode;
  filter?: (node: DirectoryNode<BASE_NODE, NODE_TYPE>) => boolean;
  /**
   * 给每个节点处理自己的 DropdownItems
   * @param node
   * @returns
   */
  renderDropdownItems?: (
    node: DirectoryNode<BASE_NODE, NODE_TYPE>,
  ) => DropdownItem<BASE_NODE, NODE_TYPE>[];
  showIndentBorder?: boolean;
  /**
   * 判断文件夹
   * @param node
   * @returns
   */
  isDirectory: (node: NODE_TYPE) => boolean;
}

/**
 * DirectoryTree 继承 Tree
 * BASE_NODE 为传入的 节点数据类型，继承于 BaseTreeNode
 * NODE_TYPE 指的是 节点的type，用于 icon 展示
 * @param {DirectoryTreeProps} props
 */
const DirectoryTree = <BASE_NODE extends BaseTreeNode, NODE_TYPE>(
  props: DirectoryTreeProps<BASE_NODE, NODE_TYPE>,
  _ref: ForwardedRef<TreeRef<DirectoryNode<BASE_NODE, NODE_TYPE>>>,
) => {
  const {
    classNames,
    actions,
    createTypes,
    showNodeCount,
    renderTag,
    renderNodeIcon,
    renderRight,
    renderDropdownItems,
    isDirectory,
    style,
    showIndentBorder = true,
    ...rest
  } = props;
  const ref = useRef<TreeRef<DirectoryNode<BASE_NODE, NODE_TYPE>>>(null);
  const onUpdate = () => {
    ref.current?.focusReload?.();
  };
  useImperativeHandle(
    _ref,
    () => ({
      ...ref.current,
      scrollToKey: () => {
        setTimeout(() => {
          // 最新架构导致的 需要延迟点
          if (ref.current) ref.current?.scrollToKey?.();
        }, 16.5 * 2);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current],
  );

  return (
    <div className={styles.tree} style={style}>
      <BaseTree<DirectoryNode<BASE_NODE, NODE_TYPE>>
        {...rest}
        className={cls(styles["tree-group"], classNames)}
        ref={ref}
        showIndentBorder={showIndentBorder}
        renderContent={(
          item: TreeIndexItem<DirectoryNode<BASE_NODE, NODE_TYPE>>,
          context: TreeItemContext,
        ) => {
          return (
            <XDirectoryNode<BASE_NODE, NODE_TYPE>
              data={item}
              showNodeCount={showNodeCount}
              createTypes={createTypes}
              onUpdate={onUpdate}
              actions={actions}
              renderDropdownItems={renderDropdownItems}
              renderTag={renderTag}
              renderRight={renderRight}
              isDirectory={isDirectory}
              renderNodeIcon={renderNodeIcon}
              {...context}
            />
          );
        }}
      />
    </div>
  );
};

export default forwardRef(DirectoryTree) as <
  BASE_NODE extends BaseTreeNode,
  NODE_TYPE,
>(
  props: DirectoryTreeProps<BASE_NODE, NODE_TYPE> & {
    ref: ForwardedRef<TreeRef<DirectoryNode<BASE_NODE, NODE_TYPE>>>;
  },
) => React.ReactElement;
