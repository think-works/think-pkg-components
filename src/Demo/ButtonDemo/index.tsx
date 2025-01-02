import { Space } from "antd";
import { BaseAction } from "@/components";

const ButtonDemo = () => {
  return (
    <Space>
      <BaseAction type="primary">primary</BaseAction>
      <BaseAction>default</BaseAction>
      <BaseAction type="dashed">dashed</BaseAction>
      <BaseAction type="text">text</BaseAction>
      <BaseAction type="link">link</BaseAction>
      <BaseAction type="link" inline>
        inline
      </BaseAction>
      <BaseAction tooltip="tooltip">tooltip</BaseAction>
      <BaseAction confirm="confirm" onClick={() => alert("confirm")}>
        confirm
      </BaseAction>
      <BaseAction popconfirm="popconfirm" onClick={() => alert("popconfirm")}>
        popconfirm
      </BaseAction>
      <BaseAction
        tooltip="tooltip"
        confirm="confirm"
        onClick={() => alert("confirm")}
      >
        tooltip & confirm
      </BaseAction>
      <BaseAction
        tooltip="tooltip"
        popconfirm="popconfirm"
        onClick={() => alert("popconfirm")}
      >
        tooltip & popconfirm
      </BaseAction>
    </Space>
  );
};

export default ButtonDemo;
