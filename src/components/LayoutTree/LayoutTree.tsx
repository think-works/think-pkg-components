import cls, { Argument } from "classnames";
import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import BaseAction, { BaseActionProps } from "../BaseAction";
import LayoutTitle, { LayoutTitleSize } from "../LayoutTitle";
import FilterTree, { FilterTreeProps, FilterTreeRef } from "./FilterTree";
import { IconActionAdd, IconAllFold, IconAllUnfold } from "./icons";
import stl from "./index.module.less";

export type LayoutTreeRef = FilterTreeRef & {};

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
  /** 标题 */
  title?: ReactNode;
  /** 扩展 */
  extend?: ReactNode;
  /** 可展开 */
  expandable?: boolean;
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

    titleSize,
    divider = true,
    title,
    extend,
    expandable = true,
    filterable = true,
    editable,

    ...rest
  } = props;

  const { add: allowAdd } = editable === true ? { add: true } : editable || {};

  // #region 导出 Ref

  const refTree = useRef<FilterTreeRef>(null);

  /**
   * 直接多层 ref 透传函数，祖父组件调用孙组件函数时，会访问到旧版闭包数据。
   * 至少需要在直接父级组件中用函数包装一次，祖父组件才会访问到新版闭包数据。
   */
  useImperativeHandle(ref, () => ({
    scrollTo: (...args) => refTree.current?.scrollTo?.(...args),

    expandAll: (...args) => refTree.current?.expandAll?.(...args),
    ensureVisible: (...args) => refTree.current?.ensureVisible?.(...args),

    addNode: (...args) => refTree.current?.addNode?.(...args),
    editNode: (...args) => refTree.current?.editNode?.(...args),
    deleteNode: (...args) => refTree.current?.deleteNode?.(...args),

    prevMatched: (...args) => refTree.current?.prevMatched?.(...args),
    nextMatched: (...args) => refTree.current?.nextMatched?.(...args),
  }));

  // #endregion

  // #region 操作组件

  const [foldState, setFoldState] = useState<"fold" | "unfold">();

  /** 展开全部 */
  const handleExpandAll = useCallback((expanded: boolean) => {
    refTree.current?.expandAll?.(expanded);
    setFoldState(expanded ? "unfold" : "fold");
  }, []);

  /** 展开收起组件 */
  const foldCom = useMemo(() => {
    if (!expandable) {
      return null;
    }

    return foldState === "unfold" ? (
      <BaseAction
        className={stl.toolAction}
        size="small"
        type="text"
        tooltip="全部收起"
        icon={<IconAllFold className={stl.allFoldIcon} />}
        onClick={() => handleExpandAll(false)}
      />
    ) : (
      <BaseAction
        className={stl.toolAction}
        size="small"
        type="text"
        tooltip="全部展开"
        icon={<IconAllUnfold className={stl.allFoldIcon} />}
        onClick={() => handleExpandAll(true)}
      />
    );
  }, [expandable, foldState, handleExpandAll]);

  /** 新建组件 */
  const addCom = useMemo(() => {
    const allowAddAction =
      typeof allowAdd === "function" ? allowAdd() : allowAdd;

    if (!allowAddAction) {
      return null;
    }

    const actionProps =
      typeof allowAddAction === "object" ? allowAddAction : {};

    const baseActionProps: BaseActionProps = {
      className: stl.toolAction,
      size: "small",
      type: "text",
      tooltip: "新建",
      icon: <IconActionAdd className={stl.addIcon} />,
      onClick: () => {
        refTree.current?.addNode?.(undefined, {
          ensureVisible: true,
          diffNode: { title: "新建" },
        });
      },
      ...actionProps,
    };
    return <BaseAction {...baseActionProps} />;
  }, [allowAdd]);

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
            <>
              {foldCom}
              {addCom}
              {extend}
            </>
          }
        />
      ) : null}
      <FilterTree
        ref={refTree}
        className={cls(stl.body, classNames?.body)}
        style={styles?.body}
        divider={divider}
        filterable={filterable}
        editable={editable}
        {...rest}
      />
    </div>
  );
});

export default LayoutTree;
