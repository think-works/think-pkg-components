import { Tabs } from "antd";
import Editable from "./Editable";
import "./index.less";

const Demo = () => {
  return (
    <div style={{ padding: 16 }}>
      <Tabs
        items={[
          {
            key: "editable",
            label: "可编辑表格",
            children: <Editable />,
          },
        ]}
      ></Tabs>
    </div>
  );
};

export default Demo;
