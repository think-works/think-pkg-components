import cls, { Argument } from "classnames";
import { LayoutTitle, LayoutTitleSize } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutActionsProps = {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    head?: Argument;
  };
  styles?: {
    head?: React.CSSProperties;
  };
  /** 标题尺寸 */
  titleSize?: LayoutTitleSize;
  /** 分割线 */
  divider?: boolean;
  /** 标题 */
  title?: React.ReactNode;
  /** 扩展 */
  extend?: React.ReactNode;
};

/**
 * 操作栏布局(目前纯粹用于占位)
 */
export const LayoutActions = (props: LayoutActionsProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    titleSize = "middle",
    divider,
    title,
    extend,
  } = props || {};

  return (
    <div className={cls(stl.layoutActions, className)} style={style}>
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
    </div>
  );
};

export default LayoutActions;
