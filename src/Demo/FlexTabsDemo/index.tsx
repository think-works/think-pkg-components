import { Button, Radio, TabsProps } from "antd";
import { useState } from "react";
import { FlexTabs, LayoutTabs, LayoutTabsProps } from "@/components";
import stl from "./index.module.less";

const FlexTabsDemo = () => {
  const [position, setPosition] = useState<TabsProps["tabPosition"]>("top");

  const flexTabsProps: LayoutTabsProps = {
    // size: "small",
    // cling: true,
    tabPosition: position,
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

  const flexExtraTabsProps = {
    ...flexTabsProps,
    tabBarExtraContent: {
      left: "left",
      right: "right",
    },
  };

  const layoutTabsProps = {
    ...flexTabsProps,
    // rimless: true,
    title: "标题",
    extend: <Button>按钮</Button>,
  };

  return (
    <div className={stl.flexTabs}>
      <Radio.Group
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        options={["top", "bottom", "left", "right"]}
      />
      <br />
      <br />
      <div style={{ border: "1px solid red" }}>
        <FlexTabs {...flexExtraTabsProps} />
      </div>
      <div style={{ border: "1px solid green" }}>
        <FlexTabs segmentedTabBar {...flexExtraTabsProps} />
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
