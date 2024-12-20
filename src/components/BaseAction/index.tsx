import {
  App,
  Button,
  ButtonProps,
  ModalFuncProps,
  Popconfirm,
  PopconfirmProps,
  Tooltip,
  TooltipProps,
} from "antd";
import cls, { Argument } from "classnames";
import { isString } from "lodash-es";
import { ForwardedRef, forwardRef, useState } from "react";
import { isType } from "@/utils/tools";
import stl from "./index.module.less";

const isPromise = (val: any): val is Promise<any> => {
  return isType(val, "Promise");
};

/**
 * 基础操作按钮
 */
export type BaseActionProps = Omit<ButtonProps, "onClick"> & {
  className?: Argument;
  /**
   * 文本提示
   */
  tooltip?: string | TooltipProps;
  /**
   * 确认弹窗modal提示
   */
  confirm?: string | ModalFuncProps;
  /**
   * 气泡二次确认
   */
  popconfirm?: string | (PopconfirmProps & { stopPropagation?: boolean });
  /**
   * 按钮内容
   */
  children?: React.ReactNode;
  /**
   * 按钮禁用
   */
  disabled?: boolean;
  /**
   * inline-block
   */
  inline?: boolean;
  /**
   * 背景透明
   */
  transparent?: boolean;
  /**
   * 文本内容居左 ｜ 居右
   */
  align?: "left" | "right";
  /**
   * 按钮点击被确认
   */
  onClick?: (...rest: any[]) => any;
};

export const BaseAction = forwardRef(function BaseActionCom(
  props: BaseActionProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) {
  const {
    className,
    tooltip,
    confirm,
    popconfirm,
    children,
    disabled,
    inline,
    transparent,
    align,
    onClick,
    ...rest
  } = props || {};

  const { modal } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleButtonClick = (...args: any[]) => {
    // 确认弹框
    if (confirm) {
      const { title: _title, ...conRest } = confirm || ({} as any);
      let title = _title;
      if (isString(confirm)) {
        title = confirm;
      }

      const handleOkClick = async (...args: any[]) => {
        return await onClick?.(...args);
      };

      modal.confirm({
        title,
        onOk: handleOkClick,
        ...conRest,
      });

      return;
    }

    // 确认气泡
    if (popconfirm) {
      return;
    }

    // 自动 loading
    const promise = onClick?.(...args);
    if (isPromise(promise)) {
      setLoading(true);
      promise.finally(() => {
        setLoading(false);
      });
    }
  };

  const content = (
    <Button
      ref={ref}
      className={cls(stl.baseAction, className, {
        [stl.inline]: inline,
        [stl.transparent]: transparent,
        [stl.alignLeft]: align === "left",
        [stl.alignRight]: align === "right",
      })}
      disabled={disabled}
      loading={loading}
      onClick={handleButtonClick}
      {...rest}
    >
      {children}
    </Button>
  );

  if (tooltip) {
    const { title: _title, ...tipRest } = tooltip || ({} as any);
    let title = _title;
    if (isString(tooltip)) {
      title = tooltip;
    }

    return (
      <Tooltip title={title} {...tipRest}>
        <span>{content}</span>
      </Tooltip>
    );
  }

  if (popconfirm) {
    const {
      title: _title,
      stopPropagation,
      ...popRest
    } = popconfirm || ({} as any);
    let title = _title;
    if (isString(popconfirm)) {
      title = popconfirm;
    }

    const handleConfirmClick = async (
      e?: React.MouseEvent<HTMLElement>,
      ...args: any[]
    ) => {
      if (stopPropagation) {
        e?.stopPropagation();
      }
      return await onClick?.(e, ...args);
    };

    return (
      <Popconfirm title={title} onConfirm={handleConfirmClick} {...popRest}>
        <span
          onClick={(e) => {
            if (stopPropagation) {
              e.stopPropagation();
            }
          }}
        >
          {content}
        </span>
      </Popconfirm>
    );
  }

  return content;
});

export default BaseAction;
