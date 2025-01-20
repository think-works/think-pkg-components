import { useEffect, useMemo, useState } from "react";
import { useMatches } from "react-router-dom";
import { useForceUpdate } from "@/hooks";
import * as events from "@/utils/events";
import { isType } from "@/utils/tools";
import { truthy } from "@/utils/types";
import { LayoutWrapperExtendRouteMeta } from "./type";
import {
  getCustomMenus,
  invokeTransformCrumb,
  LayoutWrapperCrumbReturn,
  LayoutWrapperCustomMenuPosition,
  refreshCustomMenuEventKey,
  refreshRouteCrumbEventKey,
} from "./utils";

const isString = (val: any) => isType<string>(val, "String");
const isArray = (val: any) => isType<any[]>(val, "Array");

// #region 自定义菜单

/**
 * 获取匹配的菜单 key
 */
export const useMatchMenuKeys = () => {
  const matches = useMatches();

  const menus = useMemo(() => {
    // 用匹配路由的 name/menu 作为菜单展开和选中 key
    const list = matches
      .map(({ handle }) => {
        const { name, menu } = (handle || {}) as LayoutWrapperExtendRouteMeta;
        const arr: string[] = [];

        if (menu === false) {
          return arr;
        }

        if (name) {
          arr.push(name);
        }
        if (isString(menu)) {
          arr.push(menu);
        }
        if (isArray(menu)) {
          arr.push(...menu);
        }

        return arr;
      })
      .reduce((prev, curr) => [...prev, ...curr], []);

    // 去重
    return Array.from(new Set(list));
  }, [matches]);

  // 只有 keys 发生变化时才返回新数组，以便降低菜单更新频率
  const strKeys = JSON.stringify(menus);
  const jsonKeys = useMemo(() => JSON.parse(strKeys), [strKeys]);

  return jsonKeys;
};

/**
 * 获取自定义菜单
 */
export const useCustomMenus = (position?: LayoutWrapperCustomMenuPosition) => {
  const [forceKey, forceUpdate] = useForceUpdate();
  const [menus, setMenus] = useState<ReturnType<typeof getCustomMenus>>();

  useEffect(() => {
    events.on(refreshCustomMenuEventKey, forceUpdate);

    return () => {
      events.off(refreshCustomMenuEventKey, forceUpdate);
    };
  }, [forceUpdate]);

  useEffect(() => {
    const list = getCustomMenus({ position });
    setMenus(list);
  }, [forceKey, position]);

  return menus;
};

// #endregion

// #region 命名路由面包屑

/**
 * 获取匹配的面包屑
 */
export const useMatchCrumbs = () => {
  const matches = useMatches();

  const [forceKey, forceUpdate] = useForceUpdate();
  const [crumbs, setCrumbs] = useState<LayoutWrapperCrumbReturn[]>();

  useEffect(() => {
    events.on(refreshRouteCrumbEventKey, forceUpdate);

    return () => {
      events.off(refreshRouteCrumbEventKey, forceUpdate);
    };
  }, [forceUpdate]);

  useEffect(() => {
    // 用匹配路由的 crumb/title 和 pathname 作为面包屑
    const list = matches
      .map(({ pathname, handle }) => {
        const { name, title, crumb } = (handle ||
          {}) as LayoutWrapperExtendRouteMeta;

        if (crumb === false) {
          return;
        }

        const newCrumb = invokeTransformCrumb(name || "", {
          title: crumb || title || "",
          pathname,
        });

        return newCrumb;
      })
      .filter(truthy);

    setCrumbs(list);
  }, [forceKey, matches]);

  return crumbs;
};

// #endregion

// #region 可见性开关

/**
 * 最后一个有效的可见性开关
 */
const useLastVisibility = (key: string) => {
  const matches = useMatches();
  const last = useMemo(() => {
    const list = matches
      .map(
        ({ handle }) => ((handle || {}) as LayoutWrapperExtendRouteMeta)[key],
      )
      .filter((x) => typeof x === "boolean");
    // 以最后一个有效配置为准
    return list[list.length - 1];
  }, [key, matches]);

  return last;
};

/**
 * 侧边栏可见性
 */
export const useSiderVisibility = () => {
  const last = useLastVisibility("sider");
  return last ?? false;
};

/**
 * 面包屑栏可见性
 */
export const useBreadcrumbVisibility = () => {
  const last = useLastVisibility("breadcrumb");
  return last ?? false;
};

// #endregion
