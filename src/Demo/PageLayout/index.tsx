import { useEffect } from "react";
import LayoutWrapper from "@/components/LayoutWrapper";
import { registerCustomMenus } from "@/components/LayoutWrapper/utils";

const DragContainerDemo = () => {
  useEffect(() => {
    return registerCustomMenus?.([
      {
        key: "page-layout",
        label: "page-layout",
      },
    ]);
  }, []);
  return <LayoutWrapper header={<div>header</div>}>hahahah33</LayoutWrapper>;
};

export default DragContainerDemo;
