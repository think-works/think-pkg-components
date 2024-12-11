import { Input, InputProps, Popconfirm, Space, Tooltip } from "antd";
import { ChangeEvent, useLayoutEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";

export type EditableHeaderProps = InputProps & {
  value?: string;
  /** 可删除 */
  deletable?: boolean;
  /** 删除事件 */
  onDelete?: () => void;
};

/**
 * 可编辑表头
 */
const EditableHeader = (props: EditableHeaderProps) => {
  const {
    value,
    onChange,
    onBlur,
    onPressEnter,
    deletable,
    onDelete,
    ...rest
  } = props;

  const [val, setVal] = useState(value);
  const [isEdit, setIsEdit] = useState(false);

  useLayoutEffect(() => {
    setVal(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  const handleBlur = (e: any) => {
    setIsEdit(false);
    if (typeof onBlur === "function") {
      onBlur(e);
    }
    if (typeof onChange === "function") {
      onChange({
        target: { value: val || "key" },
      } as any);
    }
  };

  const handlePressEnter = (e: any) => {
    setIsEdit(false);
    if (typeof onPressEnter === "function") {
      onPressEnter(e);
    }
    if (typeof onChange === "function") {
      onChange({
        target: { value: val || "key" },
      } as any);
    }
  };

  const handleConfirm = () => {
    if (typeof onDelete === "function") {
      onDelete();
    }
  };

  const handleDoubleClick = () => {
    setIsEdit(true);
  };

  if (isEdit) {
    return (
      <Input
        size="small"
        value={val}
        onChange={handleChange}
        onBlur={handleBlur}
        onPressEnter={handlePressEnter}
        {...rest}
      />
    );
  }

  if (deletable) {
    return (
      <Tooltip
        placement={"topLeft"}
        title={
          <Space>
            <span>{val}</span>
            <Popconfirm title="确认删除该列？" onConfirm={handleConfirm}>
              <DeleteOutlined />
            </Popconfirm>
          </Space>
        }
      >
        <span
          style={{
            display: "inline-block",
            minWidth: 100,
            height: 24,
            cursor: "pointer",
          }}
          onDoubleClick={handleDoubleClick}
        >
          {val}
        </span>
      </Tooltip>
    );
  }

  return val;
};

export default EditableHeader;
