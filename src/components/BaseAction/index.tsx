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
import { useState } from "react";
import stl from "./index.module.less";

const isType = (val: any, type: string): boolean => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

const isPromise = (val: any): val is Promise<any> => {
  return isType(val, "Promise");
};

/**
 * 基础操作按钮
 */
export type BaseActionProps = Omit<ButtonProps, "onClick"> & {
  className?: Argument;
  tooltip?: string | TooltipProps;
  confirm?: string | ModalFuncProps;
  popconfirm?: string | (PopconfirmProps & { stopPropagation?: boolean });
  children?: React.ReactNode;
  disabled?: boolean;
  inline?: boolean;
  transparent?: boolean;
  onClick?: (...rest: any[]) => any;
};

export const BaseAction = (props: BaseActionProps) => {
  const {
    className,
    tooltip,
    confirm,
    popconfirm,
    children,
    disabled,
    inline,
    transparent,
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
      className={cls(
        stl.baseAction,
        { [stl.inline]: inline, [stl.transparent]: transparent },
        className,
      )}
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
};

export default BaseAction;
