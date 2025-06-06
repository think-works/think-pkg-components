import { globalHub } from "@/utils/events";
import {
  LayoutWrapperCrumbParams,
  LayoutWrapperCustomMenuItem,
  LayoutWrapperCustomMenuMode,
  LayoutWrapperCustomMenuPosition,
  LayoutWrapperTransformCrumb,
} from "./type";

// #region 自定义菜单

const customTopMenuSet = new Set<LayoutWrapperCustomMenuItem>();
const customLeftMenuSet = new Set<LayoutWrapperCustomMenuItem>();

/** 自定义菜单事件 key */
export const refreshCustomMenuEventKey = "refreshCustomMenu";

/** 注册自定义菜单 */
export const registerCustomMenus = (
  items: LayoutWrapperCustomMenuItem[],
  options?: {
    position?: LayoutWrapperCustomMenuPosition;
    mode?: LayoutWrapperCustomMenuMode;
  },
) => {
  const { position = "left", mode = "append" } = options || {};
  // 检测位置
  let activeSet: Set<LayoutWrapperCustomMenuItem> | undefined = undefined;
  if (position === "top") {
    activeSet = customTopMenuSet;
  } else if (position === "left") {
    activeSet = customLeftMenuSet;
  }

  // 检测模式
  let clonedSet: Set<LayoutWrapperCustomMenuItem> | undefined = undefined;
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

  globalHub.emit(refreshCustomMenuEventKey);

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

    globalHub.emit(refreshCustomMenuEventKey);
  };
};

/** 获取自定义菜单 */
export const getCustomMenus = (options?: {
  position?: LayoutWrapperCustomMenuPosition;
}) => {
  const { position = "left" } = options || {};

  let activeSet: Set<LayoutWrapperCustomMenuItem> | undefined = undefined;
  if (position === "top") {
    activeSet = customTopMenuSet;
  } else if (position === "left") {
    activeSet = customLeftMenuSet;
  }

  // 菜单排序
  const list = activeSet ? Array.from(activeSet) : [];
  list.sort(({ sort: aSort = 0 }, { sort: bSort = 0 }) => aSort - bSort);
  return list as LayoutWrapperCustomMenuItem[];
};

// #endregion

// #region 命名路由面包屑

const routeCrumbMap = new Map<string, LayoutWrapperTransformCrumb>();

/** 命名路由面包屑事件 key */
export const refreshRouteCrumbEventKey = "refreshRouteCrumb";

/** 注册命名路由面包屑转换函数 */
export const registerRouteCrumb = (
  routeName: string,
  transformer: LayoutWrapperTransformCrumb,
) => {
  routeCrumbMap.set(routeName, transformer);
  globalHub.emit(refreshRouteCrumbEventKey);

  return () => {
    routeCrumbMap.delete(routeName);
    globalHub.emit(refreshRouteCrumbEventKey);
  };
};

/** 调用命名路由面包屑转换函数 */
export const invokeTransformCrumb = (
  routeName: string,
  params: LayoutWrapperCrumbParams,
) => {
  const transformer = routeCrumbMap.get(routeName);
  const crumb = transformer ? transformer(params) : params;
  return crumb;
};

// #endregion
