import LayoutWrapper, { layoutWrapperUtils } from "@/components/LayoutWrapper";

const { registerCustomMenus } = layoutWrapperUtils;
const DragContainerDemo = () => {
  registerCustomMenus([
    {
      key: "demo",
      title: "Demo",
      children: [
        {
          key: "home",
          title: "Home",
        },
      ],
    },
  ]);
  return <LayoutWrapper header={<div>header</div>}>hahahah</LayoutWrapper>;
};

export default DragContainerDemo;
