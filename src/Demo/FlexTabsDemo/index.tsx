import { Button } from "antd";
import { FlexTabs, FlexTabsProps } from "@/components";

const FlexTabsDemo = () => {
  const tabsProps: FlexTabsProps = {
    // size: "small",
    // tabPosition: "top",
    title: "标题",
    extend: <Button>按钮</Button>,
    defaultActiveKey: "tab-3",
    // tabBarExtraContent: {
    //   left: "left",
    //   right: "right",
    // },
    items: [
      {
        key: "tab-1",
        label: "tab-1",
        children: "tab-1",
      },
      {
        key: "tab-2",
        label: "tab-2",
        children: "tab-1",
        disabled: true,
      },
      {
        key: "tab-3",
        label: "tab-3",
        children: "tab-3",
      },
    ],
  };

  return (
    <div style={{ display: "flex", backgroundColor: "white" }}>
      <div style={{ flex: "auto", border: "1px solid red" }}>
        <FlexTabs {...tabsProps} />
      </div>
      <div style={{ flex: "auto", border: "1px solid green" }}>
        <FlexTabs segmentedTabBar {...tabsProps} />
      </div>
    </div>
  );
};

export default FlexTabsDemo;
