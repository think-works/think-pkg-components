import { ConfigProvider, Menu } from "antd";
import cls, { Argument } from "classnames";
import { useEffect, useState } from "react";
import { themeToken } from "@/common/theme";
import { useForceUpdate } from "@/hooks";
import * as types from "@/utils/types";
import { useCustomMenus, useMatchMenuKeys } from "../hooks";
import { LayoutWrapperMenuItem } from "../utils";
import stl from "./index.module.less";

export type LeftMenuProps = {
  className?: Argument;
  /**
   * 是否收缩 true: 收缩 false: 展开
   */
  collapsed?: boolean;
};

const LeftMenu = (props: LeftMenuProps) => {
  const { className, collapsed } = props;
  const [forceKey, forceUpdate] = useForceUpdate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [menus, setMenus] = useState<LayoutWrapperMenuItem[]>([]);

  const matchMenuKeys = useMatchMenuKeys();
  const customMenus = useCustomMenus();
  // 从路由推导菜单 key
  useEffect(() => {
    /**
     * 收缩时不展开菜单
     */
    if (collapsed) {
      setOpenKeys([]);
    } else {
      setOpenKeys(matchMenuKeys);
    }
    setSelectedKeys(matchMenuKeys);
  }, [collapsed, matchMenuKeys]);

  // 自定义路由菜单
  useEffect(() => {
    let list = customMenus.length ? customMenus : [];
    list = list.filter(types.truthy);
    setMenus(list);
    forceUpdate();
  }, [customMenus, forceUpdate]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            subMenuItemBg: "#EFF2F7",
            itemSelectedColor: "#FFF",
            itemSelectedBg: themeToken.colorPrimary,
          },
        },
      }}
    >
      <Menu
        key={forceKey}
        className={cls(stl.leftMenu, className)}
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onClick={({ keyPath }) => {
          setSelectedKeys(keyPath);
        }}
        onOpenChange={(keys: any) => {
          setOpenKeys(keys);
        }}
        items={menus}
      />
    </ConfigProvider>
  );
};

export default LeftMenu;
