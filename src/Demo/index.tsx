import { FlexTabs } from "..";
import DragContainerDemo from "./DragContainerDemo";
import EditableTableDemo from "./EditableTableDemo";
import "./index.less";

const Demo = () => {
  return (
    <FlexTabs
      items={[
        {
          key: "DragContainerDemo",
          label: "可拖拽容器",
          children: <DragContainerDemo />,
        },
        {
          key: "EditableTableDemo",
          label: "可编辑表格",
          children: <EditableTableDemo />,
        },
      ]}
    />
  );
};

export default Demo;
