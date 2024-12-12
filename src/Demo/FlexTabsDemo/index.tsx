import { FlexTabs, FlexTabsProps } from "@/components";

const FlexTabsDemo = () => {
  const tabsProps: FlexTabsProps = {
    size: "small",
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
    <div style={{ display: "flex" }}>
      <div style={{ flex: "auto", border: "1px solid red" }}>
        <FlexTabs {...tabsProps} />
      </div>
      <div style={{ flex: "auto", border: "1px solid green" }}>
        <FlexTabs radioGroupTabBar {...tabsProps} />
      </div>
    </div>
  );
};

export default FlexTabsDemo;
