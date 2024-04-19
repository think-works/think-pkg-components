import { Space } from "antd";
import { ReactNode } from "react";
import { DownOutlined } from "@ant-design/icons";
import DropdownActions, { DropdownActionsProps } from "../DropdownActions";

export type ColumnActionsProps = {
  children?: ReactNode;
  disabledDropdown?: boolean;
  dropdownText?: ReactNode;
  dropdownTrigger?: ReactNode;
  dropdownActions?: DropdownActionsProps["actions"];
  dropdownActionAlign?: DropdownActionsProps["actionAlign"];
};

/**
 * 表格操作列
 */
export const ColumnActions = (props: ColumnActionsProps) => {
  const {
    children,
    disabledDropdown,
    dropdownText,
    dropdownTrigger,
    dropdownActions,
    dropdownActionAlign,
  } = props || {};

  const _dropdownActions = dropdownActions?.map((action) => ({
    type: "link" as const,
    ...action,
  }));

  return (
    <Space>
      {children}
      {_dropdownActions?.length ? (
        <DropdownActions
          disabled={disabledDropdown}
          actions={_dropdownActions}
          actionAlign={dropdownActionAlign}
        >
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
