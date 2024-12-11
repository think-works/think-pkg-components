import { Select, SelectProps } from "antd";
import styles from "./index.module.less";

export interface SelectWithAddonBeforeProps extends SelectProps {
  /**
   * 前置文本
   */
  addonBefore?: string;
  /**
   * 选择器宽度
   */
  width?: number;
  /**
   * 自定义下拉框 里面的菜单下方的链接
   */
  renderLink?: () => React.ReactNode;
}

/**
 * 带前置文本的的下拉框
 * @param props
 * @returns
 */
export const SelectWithAddonBefore = (props: SelectWithAddonBeforeProps) => {
  const { addonBefore, width, style, renderLink, ...rest } = props;
  const value = props.value || null;
  return (
    <div className={styles.item} style={{ width, ...style }}>
      {addonBefore && <div className={styles["item-text"]}>{addonBefore}</div>}
      <Select
        {...rest}
        value={value}
        className={styles["item-form"]}
        onChange={(e, option) => props?.onChange?.(e, option)}
        options={props.options}
        rootClassName={addonBefore && styles["item-form-select"]}
        dropdownRender={
          renderLink
            ? (menu) => (
                <>
                  {menu}
                  <div className={styles.link}>{renderLink()}</div>
                </>
              )
            : undefined
        }
      >
        {props.children}
      </Select>
    </div>
  );
};
