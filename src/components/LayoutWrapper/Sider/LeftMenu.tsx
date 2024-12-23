import { ConfigProvider, Menu } from "antd";
import { MenuItemType, SubMenuType } from "antd/es/menu/interface";
import cls, { Argument } from "classnames";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { BizLayoutGap, themeToken } from "@/common/theme";
import { useForceUpdate } from "@/hooks";
import * as types from "@/utils/types";
import { useCustomMenus, useMatchMenuKeys } from "../hooks";
import { LayoutSiderItemMode } from "../type";
import { LayoutWrapperMenuItem } from "../utils";
import stl from "./index.module.less";

export type LeftMenuProps = {
  className?: Argument;
  /**
   * 侧边栏菜单模式
   */
  mode?: LayoutSiderItemMode;
  /**
   * 侧边栏收缩
   */
  collapsed?: boolean;
};
/**
 * 处理第一层菜单的 icon，激活时切换 icon
 * @param props
 * @returns
 */
const onDealMenuActiveIcon = (
  menuList: LayoutWrapperMenuItem[],
  selectedKeys: React.Key[],
) => {
  return menuList.map((menu) => {
    const { type } = menu;
    if (!type || type === "item") {
      const { key, icon, activeIcon, ...others } = menu;
      return {
        ...others,
        key,
        icon: selectedKeys.includes(key) ? activeIcon || icon : icon,
      } as MenuItemType;
    }
    return menu as MenuItemType;
  });
};

/**
 * 处理垂直菜单样式
 * @param menu
 * @returns
 */
const onDealVerticalMenu = (menuList: MenuItemType[]) => {
  const loop = (menus: (MenuItemType | SubMenuType)[], deep = 1) => {
    return menus.map(
      (
        menu: MenuItemType | SubMenuType,
      ): MenuItemType | SubMenuType<MenuItemType> => {
        const { label, icon, ...others } = menu;
        const { children } = menu as SubMenuType<MenuItemType>;
        if (children) {
          return {
            ...others,
            children: loop(
              children as (MenuItemType | SubMenuType)[],
              deep + 1,
            ),
            popupClassName: stl.verticalPopup,
            label: (
              <div className={stl.verticalItem}>
                <div
                  className={classNames(
                    stl.verticalIcon,
                    deep === 1 && "anticon",
                  )}
                >
                  {icon}
                </div>
                <div className={stl.verticalLabel}>{label}</div>
              </div>
            ),
          };
        }

        return {
          ...others,
          label: (
            <div className={stl.verticalItem}>
              <div
                className={classNames(
                  stl.verticalIcon,
                  deep === 1 && "anticon",
                )}
              >
                {icon}
              </div>
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
        itemMarginInline: BizLayoutGap,
        itemHeight: 32,
        radiusItem: 4,
        subMenuItemBg: "transparent",
      };
    }

    return {
      itemSelectedColor: themeToken.colorPrimary,
      itemSelectedBg: "#FFF",
      itemHeight: 56,
      itemMarginBlock: BizLayoutGap,
      radiusItem: 4,
      itemMarginInline: BizLayoutGap,
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
    let list = customMenus?.length
      ? onDealMenuActiveIcon(customMenus, selectedKeys)
      : [];
    list = list.filter(types.truthy) as MenuItemType[];
    /**
     * 竖直模式下，菜单项样式调整
     */
    if (mode === LayoutSiderItemMode.VERTICAL) {
      list = onDealVerticalMenu(list) as MenuItemType[];
    }
    setMenus(list);

    forceUpdate();
  }, [customMenus, forceUpdate, selectedKeys, mode]);

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
