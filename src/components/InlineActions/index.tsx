import { Divider, Space } from "antd";
import cls, { Argument } from "classnames";
import { HTMLAttributes } from "react";
import { truthy } from "@/utils/types";
import BaseAction, { BaseActionProps } from "../BaseAction";
import stl from "./index.module.less";

export type InlineActionsProps = HTMLAttributes<HTMLSpanElement> & {
  className?: Argument;
  actions?: (BaseActionProps | null | undefined)[];
  divider?: boolean;
};

/**
 * 内敛操作
 */
export const InlineActions = (props: InlineActionsProps) => {
  const { className, actions, divider, ...rest } = props || {};

  const _actions = actions?.filter(truthy);

  if (!_actions?.length) {
    return null;
  }

  if (divider) {
    return (
      <span className={cls(stl.inlineActions, className)} {...rest}>
        <Space size={4}>
          {_actions?.map((item, idx) => [
            idx === 0 ? null : (
              <Divider
                key={`divider-${idx}-${item?.children}`}
                type="vertical"
                style={{
                  margin: 0,
                }}
              />
            ),
            <BaseAction
              key={`action-${idx}-${item?.children}`}
              inline
              type="link"
              {...item}
            />,
          ])}
        </Space>
      </span>
    );
  }

  return (
    <span className={cls(stl.inlineActions, className)} {...rest}>
      <Space size={8}>
        {_actions?.map((item, idx) => (
          <BaseAction
            key={`action-${idx}-${item?.children}`}
            inline
            type="link"
            {...item}
          />
        ))}
      </Space>
    </span>
  );
};

export default InlineActions;
