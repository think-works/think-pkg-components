import { ConfigProvider, Menu, theme } from "antd";
import { MenuItemType, SubMenuType } from "antd/es/menu/interface";
import cls, { Argument } from "classnames";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { styleConfig } from "@/common/themes";
import { useForceUpdate } from "@/hooks";
import * as types from "@/utils/types";
import { useCustomMenus, useMatchMenuKeys } from "../hooks";
import { LayoutWrapperCustomMenuItem, LayoutWrapperSiderMode } from "../type";
import stl from "./index.module.less";

export type LeftMenuProps = {
  className?: Argument;
  /** 侧边栏菜单模式 */
  mode?: LayoutWrapperSiderMode;
  /** 侧边栏收缩 */
  collapsed?: boolean;
};

/** 处理第一层菜单的 icon，激活时切换 icon */
const onDealMenuActiveIcon = (
  menuList: LayoutWrapperCustomMenuItem[],
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

/** 处理垂直菜单样式 */
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

  const { token } = theme.useToken();
  const matchMenuKeys = useMatchMenuKeys();
  const customMenus = useCustomMenus();

  const menuTheme = useMemo(() => {
    if (mode === LayoutWrapperSiderMode.HORIZONTAL) {
      return {
        itemMarginBlock: 8,
        itemMarginInline: styleConfig.bizLayoutGap,
        itemHeight: 32,
        itemBorderRadius: 4,
        subMenuItemBg: "transparent",
      };
    }

    return {
      itemSelectedColor: token.colorPrimary,
      itemSelectedBg: token.colorBgElevated,
      itemHeight: 56,
      itemMarginBlock: styleConfig.bizLayoutGap,
      itemBorderRadius: 4,
      itemMarginInline: styleConfig.bizLayoutGap,
    };
  }, [mode, token.colorBgElevated, token.colorPrimary]);

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
    if (mode === LayoutWrapperSiderMode.VERTICAL) {
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
          mode === LayoutWrapperSiderMode.VERTICAL
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
