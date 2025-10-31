import { Button, GetProp, Space, Tooltip } from "antd";
import cls, { Argument } from "classnames";
import {
  CSSProperties,
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
import { truthy } from "@/utils/types";
import LayoutTitle, { LayoutTitleSize } from "../LayoutTitle";
import FilterTree, { FilterTreeProps, FilterTreeRef } from "./FilterTree";
import { IconAllFold, IconAllUnfold } from "./icons";
import stl from "./index.module.less";
import { getFieldValues, getFlatNodes } from "./utils";

export type LayoutTreeRef = FilterTreeRef & {
  /** 全部展开 */
  expandAll?: (expand?: boolean) => void;
};

export type LayoutTreeProps = FilterTreeProps & {
  className?: string;
  style?: CSSProperties;
  classNames?: FilterTreeProps["classNames"] & {
    head?: Argument;
    body?: Argument;
  };
  styles?: FilterTreeProps["styles"] & {
    head?: CSSProperties;
    body?: CSSProperties;
  };
  /** 标题尺寸 */
  titleSize?: LayoutTitleSize;
  /** 分割线 */
  divider?: boolean;
  /** 可展开 */
  expandable?: boolean;
  /** 标题 */
  title?: ReactNode;
  /** 扩展 */
  extend?: ReactNode;
};

export const LayoutTree = forwardRef(function BaseTreeCom(
  props: LayoutTreeProps,
  ref: ForwardedRef<LayoutTreeRef>,
) {
  const {
    className,
    style,
    classNames,
    styles,

    titleSize = "middle",
    divider = true,
    expandable = true,
    filterable = true,
    title,
    extend,

    treeData,
    fieldNames,
    defaultExpandedKeys,
    expandedKeys,
    onExpand,
    ...rest
  } = props;

  // #region 导出 Ref

  const refTree = useRef<FilterTreeRef>(null);

  /**
   * 直接多层 ref 透传函数，祖父组件调用孙组件函数时，会访问到旧版闭包数据。
   * 至少需要在直接父级组件中用函数包装一次，祖父组件才会访问到新版闭包数据。
   */
  useImperativeHandle(ref, () => ({
    scrollTo: (...args) => refTree.current?.scrollTo?.(...args),
    addNode: (...args) => refTree.current?.addNode?.(...args),
    editNode: (...args) => refTree.current?.editNode?.(...args),
    deleteNode: (...args) => refTree.current?.deleteNode?.(...args),
    prevMatched: refTree.current?.prevMatched,
    nextMatched: (...args) => refTree.current?.nextMatched?.(...args),

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

  // #region 处理展开收起

  const [foldState, setFoldState] = useState<"fold" | "unfold">();

  /** 平面化节点 */
  const flatNodes = useMemo(
    () => (treeData ? getFlatNodes(treeData, fieldNames) : []),
    [fieldNames, treeData],
  );

  /** 展开节点 */
  const handleExpand = useCallback<GetProp<FilterTreeProps, "onExpand">>(
    (expandedKeys, ...rest) => {
      setInnerExpandedKeys(expandedKeys);

      onExpand?.(expandedKeys, ...rest);
    },
    [onExpand],
  );

  /** 展开全部 */
  const handleExpandAll = useCallback(
    (expand?: boolean) => {
      if (expand) {
        // 全部展开
        const allKeys = flatNodes
          .map((node) => {
            const { normalKey } = getFieldValues(node, fieldNames);
            return normalKey;
          })
          .filter(truthy);

        setFoldState("unfold");
        setInnerExpandedKeys(allKeys);
        onExpand?.(allKeys, { expanded: true } as any);
      } else {
        // 全部折叠
        setFoldState("fold");
        setInnerExpandedKeys([]);
        onExpand?.([], { expanded: false } as any);
      }
    },
    [fieldNames, flatNodes, onExpand],
  );

  /** 展开收起组件 */
  const foldCom =
    foldState === "unfold" ? (
      <Tooltip title="全部收起">
        <Button
          size="small"
          type="text"
          icon={<IconAllFold className={stl.allFoldIcon} />}
          onClick={() => handleExpandAll(false)}
        />
      </Tooltip>
    ) : (
      <Tooltip title="全部展开">
        <Button
          size="small"
          type="text"
          icon={<IconAllUnfold className={stl.allFoldIcon} />}
          onClick={() => handleExpandAll(true)}
        />
      </Tooltip>
    );

  // #endregion

  return (
    <div className={cls(stl.layoutTree, className)} style={style}>
      {title || extend ? (
        <LayoutTitle
          className={cls(stl.head, classNames?.head)}
          style={styles?.head}
          size={titleSize}
          divider={divider && !filterable}
          title={title}
          extend={
            extend || expandable ? (
              <Space>
                {expandable ? foldCom : null}
                {extend}
              </Space>
            ) : null
          }
        />
      ) : null}
      <FilterTree
        ref={refTree}
        className={cls(stl.body, classNames?.body)}
        style={styles?.body}
        divider={divider}
        filterable={filterable}
        treeData={treeData}
        fieldNames={fieldNames}
        defaultExpandedKeys={defaultExpandedKeys}
        expandedKeys={innerExpandedKeys}
        onExpand={handleExpand}
        {...rest}
      />
    </div>
  );
});

export default LayoutTree;
