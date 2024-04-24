import { DragContainer, FlexTabs } from "@/index";

const DragContainerDemo = () => {
  const simpleDemo = (
    <DragContainer
      placement="left"
      dragPanelMinSize={{
        width: 200,
      }}
      dragPanelMaxSize={{
        width: 400,
      }}
      dragPanelChildren="dragPanel"
    >
      contentPanel
    </DragContainer>
  );

  const advancedDemo = (
    <DragContainer
      placement="left"
      draggableParams={{
        safeAreaLeft: 200,
        safeAreaRight: 400,
        dftWidthRatio: 0.5,
      }}
      dragPanelChildren="dragPanel"
    >
      contentPanel
    </DragContainer>
  );

  return (
    <FlexTabs
      items={[
        {
          key: "simple",
          label: "简单模式",
          children: simpleDemo,
        },
        {
          key: "advanced",
          label: "高级模式",
          children: advancedDemo,
        },
      ]}
    />
  );
};

export default DragContainerDemo;
