import { useEffect } from "react";
import { MenuItem, registerCustomMenus } from "./utils";

const GlobalInit = () => {
  useEffect(() => {
    const menus: MenuItem[] = [];

    return registerCustomMenus(menus);
  }, []);

  return null;
};

export default GlobalInit;
