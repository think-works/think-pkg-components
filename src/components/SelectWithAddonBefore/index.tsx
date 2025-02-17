import { RefSelectProps, Select, SelectProps } from "antd";
import { ForwardedRef, forwardRef } from "react";
import styles from "./index.module.less";

export type SelectWithAddonBeforeProps = SelectProps & {
  /** 前置文本 */
  addonBefore?: React.ReactNode;
  /** 选择器宽度 */
  width?: number;
  /** 自定义下拉框 里面的菜单下方的链接 */
  renderLink?: () => React.ReactNode;
};

/**
 * 带前置文本的的下拉框
 */
export const SelectWithAddonBefore = forwardRef(
  function SelectWithAddonBeforeCom(
    props: SelectWithAddonBeforeProps,
    ref: ForwardedRef<RefSelectProps>,
  ) {
    const { addonBefore, width, style, renderLink, ...rest } = props;
    const value = props.value || null;

    return (
      <div className={styles.item} style={{ width, ...style }}>
        {addonBefore && (
          <div className={styles["item-text"]}>{addonBefore}</div>
        )}
        <Select
          ref={ref}
          value={value}
          className={styles["item-form"]}
          onChange={(e, option) => props?.onChange?.(e, option)}
          options={props.options}
          rootClassName={addonBefore ? styles["item-form-select"] : undefined}
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
          {...rest}
        >
          {props.children}
        </Select>
      </div>
    );
  },
);

export default SelectWithAddonBefore;
