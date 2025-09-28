import { RefSelectProps, Select, SelectProps } from "antd";
import classNames from "classnames";
import { ForwardedRef, forwardRef } from "react";
import styles from "./index.module.less";

export type SelectWithAddonBeforeProps = SelectProps & {
  /** 前置文本 */
  addonBefore?: React.ReactNode;
  /** 后置文本 */
  addonAfter?: React.ReactNode;
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
    const { addonBefore, addonAfter, width, style, renderLink, ...rest } =
      props;
    const value = props.value || null;

    const popupRender: SelectProps["popupRender"] = renderLink
      ? (menu) => (
          <>
            {menu}
            <div className={styles.link}>{renderLink()}</div>
          </>
        )
      : undefined;

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
          rootClassName={classNames({
            [styles["item-form-select-root"]]: addonBefore,
            [styles["item-form-select-after"]]: addonAfter,
          })}
          popupRender={popupRender}
          dropdownRender={popupRender}
          {...rest}
        >
          {props.children}
        </Select>
        {addonAfter && (
          <div className={styles["item-text-after"]}>{addonAfter}</div>
        )}
      </div>
    );
  },
);

export default SelectWithAddonBefore;
