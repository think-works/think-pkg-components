import { Space } from "antd";
import { ReactNode } from "react";
import { DownOutlined } from "@ant-design/icons";
import { truthy } from "@/utils/types";
import DropdownActions, { DropdownActionsProps } from "../DropdownActions";

export type ColumnActionsProps = {
  children?: ReactNode;
  disabledDropdown?: boolean;
  dropdownText?: ReactNode;
  dropdownTrigger?: ReactNode;
  dropdownActions?: DropdownActionsProps["actions"];
};

const ColumnActions = (props: ColumnActionsProps) => {
  const {
    children,
    disabledDropdown,
    dropdownText,
    dropdownTrigger,
    dropdownActions,
  } = props || {};

  const _dropdownActions = dropdownActions?.filter(truthy);

  return (
    <Space>
      {children}
      {_dropdownActions?.length ? (
        <DropdownActions disabled={disabledDropdown} actions={dropdownActions}>
          {dropdownTrigger || (
            <a>
              <Space size={4}>
                <span>{dropdownText || "操作"}</span>
                <DownOutlined />
              </Space>
            </a>
          )}
        </DropdownActions>
      ) : null}
    </Space>
  );
};

export default ColumnActions;
