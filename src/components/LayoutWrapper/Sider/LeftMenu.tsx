import { ConfigProvider, Menu } from "antd";
import { MenuItemType, SubMenuType } from "antd/es/menu/interface";
import cls, { Argument } from "classnames";
import { useEffect, useMemo, useState } from "react";
import { themeToken } from "@/common/theme";
import { useForceUpdate } from "@/hooks";
import * as types from "@/utils/types";
import { useCustomMenus, useMatchMenuKeys } from "../hooks";
import { LayoutSiderItemMode } from "../type";
import stl from "./index.module.less";

export type LeftMenuProps = {
  className?: Argument;
  /**
   * 是否收缩 true: 收缩 false: 展开
   */
  collapsed?: boolean;
  /**
   * 侧边栏菜单展示模式
   */
  mode: LayoutSiderItemMode;
};

/**
 * 处理垂直菜单样式
 * @param menu
 * @returns
 */
const onDealVerticalMenu = (menuList: (MenuItemType | SubMenuType)[]) => {
  const loop = (menus: (MenuItemType | SubMenuType)[]) => {
    return menus.map(
      (
        menu: MenuItemType | SubMenuType,
      ): MenuItemType | SubMenuType<MenuItemType> => {
        const { label, icon, ...others } = menu;
        const { children } = menu as SubMenuType<MenuItemType>;
        if (children) {
          return {
            ...others,
            children: loop(children as (MenuItemType | SubMenuType)[]),
            popupClassName: stl.verticalPopup,
            label: (
              <div className={stl.verticalItem}>
                <div className={stl.verticalIcon}>{icon}</div>
                <div className={stl.verticalLabel}>{label}</div>
              </div>
            ),
          };
        }

        return {
          ...others,
          label: (
            <div className={stl.verticalItem}>
              <div className={stl.verticalIcon}>{icon}</div>
              <div className={stl.verticalLabel}>{label}</div>
            </div>
          ),
        };
      },
    );
  };

  return loop(menuList);
};

const LeftMenu = (props: LeftMenuProps) => {
  const { className, collapsed, mode } = props;
  const [forceKey, forceUpdate] = useForceUpdate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [menus, setMenus] = useState<(MenuItemType | SubMenuType)[]>([]);

  const matchMenuKeys = useMatchMenuKeys();
  const customMenus = useCustomMenus();

  const menuTheme = useMemo(() => {
    if (mode === LayoutSiderItemMode.HORIZONTAL) {
      return {
        itemMarginBlock: 8,
        itemMarginInline: 8,
        itemHeight: 32,
        radiusItem: 4,
        subMenuItemBg: "transparent",
      };
    }

    return {
      itemSelectedColor: themeToken.colorPrimary,
      itemSelectedBg: "#FFF",
      itemHeight: 56,
      itemMarginBlock: 8,
      radiusItem: 4,
      itemMarginInline: 8,
    };
  }, [mode]);

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
    let list = customMenus?.length ? customMenus : [];
    list = list.filter(types.truthy) as (MenuItemType | SubMenuType)[];
    /**
     * 竖直模式下，菜单项样式调整
     */
    if (mode === LayoutSiderItemMode.VERTICAL) {
      list = onDealVerticalMenu(list);
    }
    setMenus(list);

    forceUpdate();
  }, [customMenus, forceUpdate, mode]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: menuTheme,
        },
      }}
    >
      <Menu
        key={forceKey}
        triggerSubMenuAction="click"
        className={cls(
          stl.leftMenu,
          mode === LayoutSiderItemMode.VERTICAL
            ? stl.verticalMenu
            : stl.horizontalMenu,
          className,
        )}
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
