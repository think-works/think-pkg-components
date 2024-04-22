import cls, { Argument } from "classnames";
import { LayoutTitle } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutPanelProps = {
  className?: Argument;
  style?: React.CSSProperties;
  stickyTitle?: boolean;
  /** 头部分割线 */
  divider?: boolean;
  /** 内容区域紧贴头部 */
  clingContent?: boolean;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflowContent?: boolean;
  title?: React.ReactNode;
  extend?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: {
    head?: Argument;
    body?: Argument;
  };
  styles?: {
    head?: React.CSSProperties;
    body?: React.CSSProperties;
  };
};

/**
 * 面板布局
 */
export const LayoutPanel = (props: LayoutPanelProps) => {
  const {
    className,
    style,
    stickyTitle,
    divider,
    clingContent,
    overflowContent,
    title,
    extend,
    children,
    classNames,
    styles,
  } = props || {};

  return (
    <div className={cls(stl.layoutPanel, className)} style={style}>
      {title || extend ? (
        <LayoutTitle
          className={cls(
            stl.head,
            {
              [stl.sticky]: stickyTitle,
            },
            classNames?.head,
          )}
          style={styles?.head}
          size="large"
          divider={divider}
          title={title}
          extend={extend}
        />
      ) : null}
      <div
        className={cls(
          stl.body,
          {
            [stl.cling]: clingContent,
            [stl.overflow]: overflowContent,
          },
          classNames?.body,
        )}
        style={styles?.body}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutPanel;
