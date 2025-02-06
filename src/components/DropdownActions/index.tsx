import { Dropdown, DropDownProps, GetProps, MenuProps } from "antd";
import cls, { Argument } from "classnames";
import { truthy } from "@/utils/types";
import BaseAction, { BaseActionProps } from "../BaseAction";
// import { ReactComponent as IconEllipsis } from "./assets/ellipsis.svg";
import { ReactComponent as IconMore } from "./assets/more.svg";
import stl from "./index.module.less";

type DropdownButtonProps = GetProps<typeof Dropdown.Button>;
export type DropdownActionItem = BaseActionProps & {
  key?: React.Key;
  divider?: boolean;
};

export type DropdownActionsProps = (
  | ({
      buttonTrigger: true;
    } & DropdownButtonProps)
  | ({
      buttonTrigger?: false;
    } & DropDownProps)
) & {
  className?: Argument;
  actions?: (DropdownActionItem | null | undefined)[];
  actionAlign?: BaseActionProps["align"];
  children?: React.ReactNode;
};

/**
 * 下拉操作
 */
export const DropdownActions = (props: DropdownActionsProps) => {
  const {
    className,
    buttonTrigger,
    actions,
    actionAlign = "left",
    children,
    ...rest
  } = props || {};

  const _actions = actions?.filter(truthy);

  if (!_actions?.length) {
    return null;
  }

  const items: MenuProps["items"] = _actions?.map((action, idx) => {
    const { key, divider, ...actionRest } = action || {};
    if (divider) {
      return {
        key: key || idx,
        type: "divider",
      };
    }
    return {
      key: key || idx,
      label: (
        <BaseAction block type="text" align={actionAlign} {...actionRest} />
      ),
    };
  });

  if (buttonTrigger) {
    return (
      <Dropdown.Button menu={{ items }} {...rest}>
        {children}
      </Dropdown.Button>
    );
  }

  return (
    <Dropdown
      overlayClassName={cls(stl.dropdownActions, className)}
      placement="bottomRight"
      menu={{ items }}
      {...rest}
    >
      {children || <IconMore className={stl.actionIcon} />}
    </Dropdown>
  );
};

export default DropdownActions;
