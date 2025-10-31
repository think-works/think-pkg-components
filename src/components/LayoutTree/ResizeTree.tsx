import { Empty, GetProp, GetRef, Tree, TreeDataNode, TreeProps } from "antd";
import cls, { Argument } from "classnames";
import {
  CSSProperties,
  DragEventHandler,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { CaretDownOutlined } from "@ant-design/icons";
import { styleConfig } from "@/common/themes";
import { useDebounce } from "@/hooks";
import { truthy } from "@/utils/types";
import Resizing from "../Resizing";
import { IconFolderClose, IconFolderOpen } from "./icons";
import stl from "./index.module.less";
import { getFieldValues, getFlatNodes } from "./utils";

const scrollDebounce = 200;
const scrollBoundary = 20;
const scrollBaseline = 20;
const scrollRate = 1.1;

type TreeRef = GetRef<typeof Tree>;

export type ResizeNodeRender = GetProp<TreeProps, "titleRender">;

export type ResizeTreeRef = {
  /** 滚动树 */
  scrollTo?: TreeRef["scrollTo"];
  /** 全部展开 */
  expandAll?: (expanded?: boolean) => void;
};

export type ResizeTreeProps = TreeProps & {
  className?: string;
  style?: CSSProperties;
  classNames?: {
    tree?: Argument;
  };
  styles?: {
    tree?: CSSProperties;
  };
  /** 拖拽时自动滚动 */
  dragAutoScroll?: boolean;
  /** 默认虚拟滚动容器高度 */
  defaultHeight?: number;
  /** 点击节点标题触发展开 */
  expandByTitle?: boolean;
  /** 叶子节点图标(true: 使用目录图标) */
  leafIcon?: true | ReactNode | GetProp<TreeProps, "icon">;
  /** 节点图标渲染 */
  nodeIconRender?: ResizeNodeRender;
  /** 节点标题渲染 */
  nodeTitleRender?: ResizeNodeRender;
  /** 节点计数渲染 */
  nodeCountRender?: ResizeNodeRender;
  /** 节点操作渲染 */
  nodeActionRender?: ResizeNodeRender;
  /** 节点包装渲染 */
  nodeWrapperRender?: (
    children: ReactNode,
    nodeData: TreeDataNode,
  ) => ReactNode;
};

export const ResizeTree = forwardRef(function BaseTreeCom(
  props: ResizeTreeProps,
  ref: ForwardedRef<ResizeTreeRef>,
) {
  const {
    className,
    style,
    classNames,
    styles,

    dragAutoScroll = true,
    defaultHeight = 100,
    expandByTitle,
    leafIcon,
    nodeIconRender,
    nodeTitleRender,
    nodeCountRender,
    nodeActionRender,
    nodeWrapperRender,

    treeData,
    fieldNames,
    defaultExpandedKeys,
    expandedKeys,
    onExpand,
    onDragStart,
    onDragOver,
    icon,
    titleRender,
    ...rest
  } = props;

  // #region 导出 Ref

  const refTree = useRef<TreeRef>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: (...args) => refTree.current?.scrollTo(...args),

    expandAll: handleExpandAll,
  }));

  // #endregion

  // #region 同步外部属性

  const [innerExpandedKeys, setInnerExpandedKeys] = useState(
    expandedKeys || defaultExpandedKeys,
  );

  useEffect(() => {
    setInnerExpandedKeys(expandedKeys);
  }, [expandedKeys]);

  // #endregion

  // #region 展开收起

  /** 平面化节点 */
  const flatNodes = useMemo(
    () => (treeData ? getFlatNodes(treeData, fieldNames) : []),
    [fieldNames, treeData],
  );

  /** 展开节点 */
  const handleExpand = useCallback<GetProp<TreeProps, "onExpand">>(
    (expandedKeys, ...rest) => {
      setInnerExpandedKeys(expandedKeys);

      onExpand?.(expandedKeys, ...rest);
    },
    [onExpand],
  );

  /** 展开全部 */
  const handleExpandAll = useCallback(
    (expanded?: boolean) => {
      const nextKeys = !expanded
        ? []
        : flatNodes
            .map((node) => {
              const { normalKey } = getFieldValues(node, fieldNames);
              return normalKey;
            })
            .filter(truthy);

      setInnerExpandedKeys(nextKeys);
      onExpand?.(nextKeys, { expanded } as any);
    },
    [fieldNames, flatNodes, onExpand],
  );

  // #endregion

  // #region 自动滚动

  /**
   * Tree 组件似乎自带拖拽滚动功能，但有些问题，暂时自行实现。
   * https://github.com/ant-design/ant-design/issues/54284
   * https://github.com/ant-design/ant-design/issues/31057#issuecomment-1206278137
   */

  const [height, setHeight] = useState(defaultHeight);

  const refResizing = useRef<HTMLDivElement>(null);
  const refTreeListHolder = useRef<HTMLDivElement>(null);

  const refScrollDirection = useRef<"up" | "down">("down");
  const refScrollDistance = useRef<number>(scrollBaseline);

  useEffect(() => {
    const prefixCls = styleConfig.antPrefixClass;
    const div = refResizing.current?.querySelector(
      `.${prefixCls}-tree-list-holder`,
    );

    if (div) {
      refTreeListHolder.current = div as HTMLDivElement;
    }

    return () => {
      refTreeListHolder.current = null;
    };
  }, [treeData]);

  const handleAutoScroll = useCallback<DragEventHandler<HTMLDivElement>>(
    (e) => {
      const holder = refTreeListHolder.current;
      const node = e.target as HTMLDivElement;
      const prevDirection = refScrollDirection.current;
      const prevDistance = refScrollDistance.current;

      if (!(holder && node)) {
        return;
      }

      // 元素位置
      const { top: holderTop, bottom: holderBottom } =
        holder.getBoundingClientRect();
      const { top: nodeTop, bottom: nodeBottom } = node.getBoundingClientRect();

      // 滚动方向
      let nextDirection = prevDirection;
      if (nodeTop < holderTop + scrollBoundary) {
        nextDirection = "up";
      } else if (holderBottom < nodeBottom + scrollBoundary) {
        nextDirection = "down";
      } else {
        // 重置滚动参数
        refScrollDistance.current = scrollBaseline;
        return;
      }

      // 滚动距离
      let nextDistance = prevDistance;
      if (prevDirection === nextDirection) {
        // 加速滚动
        nextDistance = prevDistance * scrollRate;
      } else {
        // 重置滚动参数
        nextDistance = scrollBaseline;
      }

      refScrollDirection.current = nextDirection;
      refScrollDistance.current = nextDistance;

      const top = nextDirection === "up" ? -nextDistance : nextDistance;
      holder.scrollBy({ top });
    },
    [],
  );

  const handleAutoScrollDebounce = useDebounce(
    handleAutoScroll,
    scrollDebounce,
  );

  const handleDragStart = useCallback<GetProp<TreeProps, "onDragStart">>(
    (info, ...rest) => {
      // 重置滚动参数
      refScrollDistance.current = scrollBaseline;

      onDragStart?.(info, ...rest);
    },
    [onDragStart],
  );

  const handleDragOver = useCallback<GetProp<TreeProps, "onDragOver">>(
    (info, ...rest) => {
      const { event } = info;

      if (dragAutoScroll) {
        handleAutoScrollDebounce(event);
      }

      onDragOver?.(info, ...rest);
    },
    [dragAutoScroll, handleAutoScrollDebounce, onDragOver],
  );

  // #endregion

  // #region 渲染图标

  /** 渲染图标 */
  const handleIcon = useCallback<
    Exclude<GetProp<TreeProps, "icon">, ReactNode>
  >(
    (nodeProps, ...rest) => {
      const { expanded, isLeaf } = nodeProps || {};
      const data = (nodeProps as any)?.data;

      const { normalChildren } = getFieldValues(data, fieldNames);

      // 优先使用外部属性
      if (icon) {
        return typeof icon === "function" ? icon(nodeProps, ...rest) : icon;
      }

      // 侦测叶子节点(仅支持特定数据结构)
      if (isLeaf || !normalChildren?.length) {
        if (typeof leafIcon === "function") {
          return leafIcon(nodeProps, ...rest);
        }
        if (leafIcon === true) {
          return <IconFolderClose className={cls(stl.folderIcon, stl.leaf)} />;
        }
        return leafIcon;
      }

      return expanded ? (
        <IconFolderOpen className={stl.folderIcon} />
      ) : (
        <IconFolderClose className={stl.folderIcon} />
      );
    },
    [fieldNames, icon, leafIcon],
  );

  // #endregion

  // #region 渲染节点

  /** 切换展开状态 */
  const switchExpandState = useCallback(
    (node: TreeDataNode) => {
      const prevKeys = innerExpandedKeys || [];
      const filterKeys = prevKeys?.filter((key) => key !== node.key);
      const expanded = prevKeys.length === filterKeys.length;
      const nextKeys = expanded ? [...prevKeys, node.key] : filterKeys;

      setInnerExpandedKeys(nextKeys);
      onExpand?.(nextKeys, { expanded } as any);
    },
    [innerExpandedKeys, onExpand],
  );

  /** 渲染节点 */
  const handleTitleRender = useCallback<ResizeNodeRender>(
    (nodeData, ...rest) => {
      const { normalTitle } = getFieldValues(nodeData, fieldNames);

      // 优先使用外部属性
      let child =
        typeof normalTitle === "function"
          ? normalTitle(nodeData, ...rest)
          : normalTitle;

      if (titleRender) {
        child = titleRender(nodeData, ...rest);
      }

      // 自定义节点渲染
      const nodeComArr: ReactNode[] = [];
      const nodeIconCom = nodeIconRender?.(nodeData, ...rest);
      const nodeTitleCom = nodeTitleRender?.(nodeData, ...rest);
      const nodeCountCom = nodeCountRender?.(nodeData, ...rest);
      const nodeActionCom = nodeActionRender?.(nodeData, ...rest);

      // 节点图标
      if (nodeIconCom) {
        nodeComArr.push(
          <div key="nodeIcon" className={stl.nodeIcon}>
            {nodeIconCom}
          </div>,
        );
      }

      // 节点标题
      nodeComArr.push(
        <div key="nodeTitle" className={stl.nodeTitle}>
          {nodeTitleCom || child}
        </div>,
      );

      // 节点计数器
      if (nodeCountCom) {
        nodeComArr.push(
          <div key="nodeCount" className={stl.nodeCount}>
            {nodeCountCom}
          </div>,
        );
      }

      // 节点操作
      if (nodeActionCom) {
        nodeComArr.push(
          <div
            key="nodeAction"
            className={stl.nodeAction}
            onClick={(e) => {
              // 避免选中树节点
              e.stopPropagation();
            }}
          >
            {nodeActionCom}
          </div>,
        );
      }

      // 有效节点
      if (nodeComArr.length) {
        child = (
          <div
            className={stl.nodeContainer}
            onClick={() => {
              if (expandByTitle) {
                switchExpandState(nodeData);
              }
            }}
          >
            {nodeComArr}
          </div>
        );
      }

      // 节点包装
      if (nodeWrapperRender) {
        return nodeWrapperRender(child, nodeData);
      }

      return child;
    },
    [
      expandByTitle,
      fieldNames,
      nodeActionRender,
      nodeCountRender,
      nodeIconRender,
      nodeTitleRender,
      nodeWrapperRender,
      switchExpandState,
      titleRender,
    ],
  );

  // #endregion

  return (
    <Resizing
      ref={refResizing}
      className={cls(stl.resizeTree, className)}
      style={style}
      onResize={(w, h) => setHeight(h)}
    >
      {treeData?.length ? (
        <Tree
          ref={refTree}
          className={cls(stl.tree, classNames?.tree)}
          style={styles?.tree}
          virtual
          showLine
          blockNode
          height={height}
          treeData={treeData}
          fieldNames={fieldNames}
          defaultExpandedKeys={defaultExpandedKeys}
          expandedKeys={innerExpandedKeys}
          onExpand={handleExpand}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          icon={handleIcon}
          titleRender={handleTitleRender}
          switcherIcon={<CaretDownOutlined className={stl.switcherIcon} />}
          {...rest}
        />
      ) : (
        <Empty className={stl.empty} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Resizing>
  );
});

export default ResizeTree;
