import { Form, FormItemProps } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type FilterItemProps = FormItemProps & {
  className?: Argument;
  style?: React.CSSProperties;
  /** 定制样式 */
  customStyle?: boolean;
};

/**
 * 筛选项 (建议配合 variant="borderless" 使用)
 */
export const FilterItem = (props: FilterItemProps) => {
  const {
    className,
    style,
    customStyle = true,
    label,
    children,
    ...rest
  } = props;

  return (
    <Form.Item
      className={cls(stl.filterItem, className, {
        [stl.customStyle]: customStyle,
      })}
      style={style}
      colon={customStyle ? false : undefined}
      label={
        customStyle && label ? <div className={stl.label}>{label}</div> : label
      }
      {...rest}
    >
      {children}
    </Form.Item>
  );
};

export default FilterItem;
