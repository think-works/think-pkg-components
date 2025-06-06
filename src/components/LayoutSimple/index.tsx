import cls, { Argument } from "classnames";
import { LayoutTitle, LayoutTitleSize } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutSimpleProps = {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    head?: Argument;
    body?: Argument;
  };
  styles?: {
    head?: React.CSSProperties;
    body?: React.CSSProperties;
  };
  /** 标题尺寸 */
  titleSize?: LayoutTitleSize;
  /** 分割线 */
  divider?: boolean;
  /** 无内边距 */
  rimless?: boolean;
  /** 内容区域紧贴头部 */
  cling?: boolean;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflow?: boolean;
  /** 标题 */
  title?: React.ReactNode;
  /** 扩展 */
  extend?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * 简单布局
 */
export const LayoutSimple = (props: LayoutSimpleProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    titleSize = "middle",
    divider = true,
    rimless,
    cling,
    overflow,
    title,
    extend,
    children,
  } = props || {};

  return (
    <div
      className={cls(stl.layoutSimple, className, {
        [stl.rimless]: rimless,
      })}
      style={style}
    >
      {title || extend ? (
        <LayoutTitle
          className={cls(stl.head, classNames?.head)}
          style={styles?.head}
          size={titleSize}
          divider={divider}
          title={title}
          extend={extend}
        />
      ) : null}
      <div
        className={cls(stl.body, classNames?.body, {
          [stl.cling]: cling,
          [stl.overflow]: overflow,
        })}
        style={styles?.body}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutSimple;
