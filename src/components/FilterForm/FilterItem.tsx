import { Form, FormItemProps } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type FilterItemProps = FormItemProps & {
  className?: Argument;
  style?: React.CSSProperties;

  /** 启用定制样式 */
  outlined?: boolean;
};

/**
 * 定制筛选项
 */
export const FilterItem = (props: FilterItemProps) => {
  const { className, style, outlined, children, ...rest } = props;

  return (
    <Form.Item
      className={cls(stl.filterItem, className, {
        [stl.outlined]: outlined,
      })}
      style={style}
      {...rest}
    >
      {children}
    </Form.Item>
  );
};

export default FilterItem;
