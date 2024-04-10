import { Divider } from "antd";
import cls, { Argument } from "classnames";
import BaseAction, { BaseActionProps } from "../BaseAction";
import stl from "./index.module.less";

export type InlineActionsProps = {
  className?: Argument;
  actions?: (BaseActionProps | null | undefined)[];
  divider?: boolean;
};

const InlineActions = (props: InlineActionsProps) => {
  const { className, actions, divider, ...rest } = props || {};

  if (divider) {
    return (
      <span className={cls(stl.inlineActions, className)} {...rest}>
        {(actions || [])
          .filter(Boolean)
          .map((item, idx) => [
            idx === 0 ? null : (
              <Divider
                key={`divider-${idx}-${item?.children}`}
                type="vertical"
              />
            ),
            <BaseAction
              key={`action-${idx}-${item?.children}`}
              inline
              type="link"
              {...item}
            />,
          ])}
      </span>
    );
  }

  return (
    <span className={cls(stl.inlineActions, className)} {...rest}>
      {(actions || []).filter(Boolean).map((item, idx) => (
        <BaseAction
          key={`action-${idx}-${item?.children}`}
          inline
          type="link"
          {...item}
        />
      ))}
    </span>
  );
};

export default InlineActions;
