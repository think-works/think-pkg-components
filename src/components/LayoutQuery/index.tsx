import cls, { Argument } from "classnames";
import { LayoutTitle, LayoutTitleSize } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutQueryProps = {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    head?: Argument;
    body?: Argument;
    tools?: Argument;
    result?: Argument;
    title?: Argument;
    extend?: Argument;
  };
  styles?: {
    head?: React.CSSProperties;
    body?: React.CSSProperties;
    tools?: React.CSSProperties;
    result?: React.CSSProperties;
    title?: React.CSSProperties;
    extend?: React.CSSProperties;
  };
  /** 标题尺寸 */
  titleSize?: LayoutTitleSize;
  /** 组件边框 */
  bordered?: boolean;
  /** 无内边距 */
  rimless?: boolean;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflow?: boolean;
  /** 筛选 */
  filter?: React.ReactNode;
  /** 标题 */
  title?: React.ReactNode;
  /** 扩展 */
  extend?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * 查询布局
 */
export const LayoutQuery = (props: LayoutQueryProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    titleSize,
    bordered = true,
    rimless,
    overflow,
    filter,
    title,
    extend,
    children,
  } = props || {};

  return (
    <div
      className={cls(stl.layoutQuery, className, {
        [stl.bordered]: bordered,
        [stl.rimless]: rimless,
      })}
      style={style}
    >
      {filter ? (
        <div className={cls(stl.head, classNames?.head)} style={styles?.head}>
          {filter}
        </div>
      ) : null}
      <div
        className={cls(stl.body, classNames?.body, {
          [stl.showTools]: title || extend,
        })}
        style={styles?.body}
      >
        {title || extend ? (
          <LayoutTitle
            className={cls(stl.tools, classNames?.tools)}
            style={styles?.tools}
            size={titleSize}
            title={title}
            extend={extend}
          />
        ) : null}
        <div
          className={cls(stl.result, classNames?.result, {
            [stl.overflow]: overflow,
          })}
          style={styles?.result}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutQuery;
