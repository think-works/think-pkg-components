import { Space } from "antd";
import { ReactNode } from "react";
import { DownOutlined } from "@ant-design/icons";
import { useComponentsLocale } from "@/i18n/hooks";
import { truthy } from "@/utils/types";
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

  const { locale } = useComponentsLocale();

  const _dropdownActions = dropdownActions?.filter(truthy)?.map((action) => ({
    type: "link" as const,
    ...action,
  }));

  if (!_dropdownActions?.length) {
    return children;
  }

  return (
    <Space>
      {children}
      <DropdownActions
        disabled={disabledDropdown}
        actions={_dropdownActions}
        actionAlign={dropdownActionAlign}
      >
        {dropdownTrigger || (
          <a>
            <Space size={4}>
              <span>{dropdownText || locale.common.actionText}</span>
              <DownOutlined />
            </Space>
          </a>
        )}
      </DropdownActions>
    </Space>
  );
};

export default ColumnActions;
