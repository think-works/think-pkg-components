import { Form, FormItemProps } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type FilterItemProps = FormItemProps & {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    label?: Argument;
  };
  styles?: {
    label?: React.CSSProperties;
  };

  /** 标准样式 */
  standard?: boolean;
};

/**
 * 筛选项 (建议配合 variant="borderless" 使用)
 */
export const FilterItem = (props: FilterItemProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    standard,
    label,
    children,
    ...rest
  } = props;

  return (
    <Form.Item
      className={cls(stl.filterItem, className, {
        [stl.outlined]: !standard,
      })}
      style={style}
      colon={standard ? undefined : false}
      label={
        !standard && label ? (
          <div
            className={cls(stl.label, classNames?.label)}
            style={styles?.label}
            title={typeof label === "string" ? label : undefined}
          >
            {label}
          </div>
        ) : (
          label
        )
      }
      {...rest}
    >
      {children}
    </Form.Item>
  );
};

export default FilterItem;
