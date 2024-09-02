import { useEffect } from "react";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useRegisterCustomMenus } from "@/components/LayoutWrapper/hooks";

const DragContainerDemo = () => {
  const registerCustomMenus = useRegisterCustomMenus();

  useEffect(() => {
    registerCustomMenus?.([
      {
        key: "page-layout",
        label: "page-layout",
      },
    ]);
  }, [registerCustomMenus]);
  return <LayoutWrapper header={<div>header</div>}>hahahah1233</LayoutWrapper>;
};

export default DragContainerDemo;
