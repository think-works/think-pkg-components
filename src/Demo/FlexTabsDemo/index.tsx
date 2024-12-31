import { Button } from "antd";
import { FlexTabs, LayoutTabs, LayoutTabsProps } from "@/components";

const FlexTabsDemo = () => {
  const tabsProps: LayoutTabsProps = {
    // size: "small",
    tabPosition: "left",
    // clingContent: true,
    title: "标题",
    extend: <Button>按钮</Button>,
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

  return (
    <div>
      <div style={{ border: "1px solid red" }}>
        <FlexTabs {...tabsProps} />
      </div>
      <div style={{ border: "1px solid green" }}>
        <FlexTabs segmentedTabBar {...tabsProps} />
      </div>
      <div style={{ border: "1px solid blue" }}>
        <LayoutTabs {...tabsProps} />
      </div>
      <div style={{ border: "1px solid yellow" }}>
        <LayoutTabs segmentedTabBar {...tabsProps} />
      </div>
    </div>
  );
};

export default FlexTabsDemo;
