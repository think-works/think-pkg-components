import { Dropdown, DropDownProps, GetProps, MenuProps } from "antd";
import cls, { Argument } from "classnames";
import BaseAction, { BaseActionProps } from "../BaseAction";
// import { ReactComponent as IconEllipsis } from "./assets/ellipsis.svg";
import { ReactComponent as IconMore } from "./assets/more.svg";
import stl from "./index.module.less";

type DropdownButtonProps = GetProps<typeof Dropdown.Button>;
type DropdownActionItem = BaseActionProps & {
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
  children?: React.ReactNode;
};

const DropdownActions = (props: DropdownActionsProps) => {
  const { className, buttonTrigger, actions, children, ...rest } = props || {};

  const items: MenuProps["items"] = (actions || [])
    .filter(Boolean)
    .map((action, idx) => {
      const { key, divider, ...actionRest } = action || {};
      if (divider) {
        return {
          key: key || idx,
          type: "divider",
        };
      }
      return {
        key: key || idx,
        label: <BaseAction transparent type="text" {...actionRest} />,
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
