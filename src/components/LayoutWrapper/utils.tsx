import { MenuProps } from "antd";
import { ReactNode } from "react";
import { To } from "react-router-dom";
import * as events from "@/utils/events";

// #region 注册自定义菜单

export type LayoutWrapperCustomMenuPosition = "top" | "left";
type LayoutWrapperCustomMenuMode = "append" | "replace";

export type LayoutWrapperMenuItem = NonNullable<MenuProps["items"]>[number] & {
  /** 菜单顺序 */
  sort?: number;
};

export const refreshCustomMenuEventKey = "refreshCustomMenu";

const customTopMenuSet = new Set<LayoutWrapperMenuItem>();
const customLeftMenuSet = new Set<LayoutWrapperMenuItem>();

/**
 * 注册自定义菜单
 */
export const registerCustomMenus = (
  items: LayoutWrapperMenuItem[],
  options?: {
    position?: LayoutWrapperCustomMenuPosition;
    mode?: LayoutWrapperCustomMenuMode;
  },
) => {
  const { position = "left", mode = "append" } = options || {};
  // 检测位置
  let activeSet: Set<LayoutWrapperMenuItem> | undefined = undefined;
  if (position === "top") {
    activeSet = customTopMenuSet;
  } else if (position === "left") {
    activeSet = customLeftMenuSet;
  }

  // 检测模式
  let clonedSet: Set<LayoutWrapperMenuItem> | undefined = undefined;
  if (mode === "append") {
    items.forEach((item) => {
      // 将本次项目追加至集合尾部
      activeSet?.add(item);
    });
  } else if (mode === "replace") {
    // 保留集合快照
    clonedSet = new Set(activeSet);
    // 清理集合中的已存在项目
    activeSet?.clear();
    // 将本次项目追加至集合尾部
    items.forEach((item) => {
      activeSet?.add(item);
    });
  }

  events.emit(refreshCustomMenuEventKey);

  return () => {
    if (mode === "append") {
      // 将本次项目从集合中删除
      items.forEach((item) => {
        activeSet?.delete(item);
      });
    } else if (mode === "replace") {
      /* 集合可能已经被多次改变，不能直接清理 */
      // 将本次项目从集合中删除
      items.forEach((item) => {
        activeSet?.delete(item);
      });
      // 暂存集合中的剩余项目
      const tempSet = new Set(activeSet);
      // 清理集合中的剩余项目
      activeSet?.clear();
      // 将保留的集合快照追加至集合尾部
      clonedSet?.forEach((item) => {
        activeSet?.add(item);
      });
      // 将暂存的剩余项目追加至集合尾部
      tempSet.forEach((item) => {
        activeSet?.add(item);
      });
    }

    events.emit(refreshCustomMenuEventKey);
  };
};

/**
 * 获取自定义菜单
 */
export const getCustomMenus = (options?: {
  position?: LayoutWrapperCustomMenuPosition;
}) => {
  const { position = "left" } = options || {};

  let activeSet: Set<LayoutWrapperMenuItem> | undefined = undefined;
  if (position === "top") {
    activeSet = customTopMenuSet;
  } else if (position === "left") {
    activeSet = customLeftMenuSet;
  }

  // 菜单排序
  const list = activeSet ? Array.from(activeSet) : [];
  list.sort(({ sort: aSort = 0 }, { sort: bSort = 0 }) => aSort - bSort);
  return list;
};

// #endregion

// #region 注册命名路由面包屑

export type LayoutWrapperCrumbParams = {
  /**
   * 面包屑标题
   */
  title?: string;
  /**
   * 面包屑路径
   */
  pathname?: string;
};

export type LayoutWrapperCrumbReturn = LayoutWrapperCrumbParams & {
  /**
   * 面包屑目标位置
   */
  to?: To;
  /**
   * 面包屑元素
   */
  element?: ReactNode;
};

export type LayoutWrapperTransformCrumb = (
  params: LayoutWrapperCrumbParams,
) => false | LayoutWrapperCrumbReturn;

export const refreshRouteCrumbEventKey = "refreshRouteCrumb";

const routeCrumbMap = new Map<string, LayoutWrapperTransformCrumb>();

/**
 * 注册命名路由面包屑转换函数
 */
export const registerRouteCrumb = (
  routeName: string,
  transformer: LayoutWrapperTransformCrumb,
) => {
  routeCrumbMap.set(routeName, transformer);
  events.emit(refreshRouteCrumbEventKey);

  return () => {
    routeCrumbMap.delete(routeName);
    events.emit(refreshRouteCrumbEventKey);
  };
};

/**
 * 调用命名路由面包屑转换函数
 */
export const invokeTransformCrumb = (
  routeName: string,
  params: LayoutWrapperCrumbParams,
) => {
  const transformer = routeCrumbMap.get(routeName);
  const crumb = transformer ? transformer(params) : params;
  return crumb;
};

// #endregion
