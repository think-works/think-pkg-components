import cls, { Argument } from "classnames";
import BaseText from "../BaseText";
import stl from "./index.module.less";

export type LayoutCardProps = {
  className?: Argument;
  style?: React.CSSProperties;
  bordered?: boolean;
  clingContent?: boolean;
  divider?: boolean;
  title?: React.ReactNode;
  extra?: React.ReactNode;
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
 * 布局卡片
 */
export const LayoutCard = (props: LayoutCardProps) => {
  const {
    className,
    style,
    bordered,
    clingContent,
    divider,
    title,
    extra,
    children,
    classNames,
    styles,
  } = props || {};

  return (
    <div
      className={cls(stl.layoutCard, className, {
        [stl.bordered]: bordered,
      })}
      style={style}
    >
      {title || extra ? (
        <div
          className={cls(stl.head, classNames?.head, {
            [stl.divider]: divider,
          })}
          style={styles?.head}
        >
          <div className={stl.title}>
            <BaseText type="sub">{title}</BaseText>
          </div>
          <div className={stl.extra}>{extra}</div>
        </div>
      ) : null}
      <div
        className={cls(
          stl.body,
          {
            [stl.cling]: clingContent,
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

export default LayoutCard;
