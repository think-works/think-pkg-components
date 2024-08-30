import { Menu } from "antd";
import cls, { Argument } from "classnames";
import { useEffect, useState } from "react";
import { types, useForceUpdate } from "@think/components";
import { useCustomMenus, useMatchMenuKeys } from "../hooks";
import { defaultLeftMenus } from "../menus";
import { MenuItem } from "../utils";
import stl from "./index.module.less";

export type LeftMenuProps = {
  className?: Argument;
};

const LeftMenu = (props: LeftMenuProps) => {
  const { className } = props;
  const [forceKey, forceUpdate] = useForceUpdate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>(defaultLeftMenus);

  const matchMenuKeys = useMatchMenuKeys();
  const customMenus = useCustomMenus();

  // 从路由推导菜单 key
  useEffect(() => {
    setOpenKeys(matchMenuKeys);
    setSelectedKeys(matchMenuKeys);
  }, [matchMenuKeys]);

  // 自定义路由菜单
  useEffect(() => {
    let list = customMenus.length ? customMenus : defaultLeftMenus;
    list = list.filter(types.truthy);

    setMenus(list);
    forceUpdate();
  }, [customMenus, forceUpdate]);

  return (
    <Menu
      key={forceKey}
      className={cls(stl.leftMenu, className)}
      theme="light"
      mode="inline"
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onClick={(keys: any) => {
        setSelectedKeys(keys);
      }}
      onOpenChange={(keys: any) => {
        setOpenKeys(keys);
      }}
      items={menus}
    />
  );
};

export default LeftMenu;
