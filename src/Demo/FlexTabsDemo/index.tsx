import { Button } from "antd";
import { FlexTabs, LayoutTabs, LayoutTabsProps } from "@/components";

const FlexTabsDemo = () => {
  const flexTabsProps: LayoutTabsProps = {
    // size: "small",
    // tabPosition: "left",
    // cling: true,
    defaultActiveKey: "tab-3",
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
  const layoutTabsProps = {
    ...flexTabsProps,
    // rimless: true,
    title: "标题",
    extend: <Button>按钮</Button>,
  };

  return (
    <div style={{ backgroundColor: "#ddd" }}>
      <div style={{ border: "1px solid red" }}>
        <FlexTabs {...flexTabsProps} />
      </div>
      <div style={{ border: "1px solid green" }}>
        <FlexTabs segmentedTabBar {...flexTabsProps} />
      </div>
      <div style={{ border: "1px solid blue" }}>
        <LayoutTabs {...layoutTabsProps} />
      </div>
      <div style={{ border: "1px solid yellow" }}>
        <LayoutTabs segmentedTabBar {...layoutTabsProps} />
      </div>
    </div>
  );
};

export default FlexTabsDemo;
