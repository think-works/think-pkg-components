/**
 * 注意：
 * 本文件中的 样式配置 和 主题变量 部分，
 * 需与 @/styles/basic.less 保持一致。
 */
import { ConfigProviderProps, ThemeConfig } from "antd";

/** 颜色方案 */
export type ColorScheme = "light" | "dark";

// #region 颜色方案配置

/** 获取样式配置 */
export const getStyleConfig = (scheme?: ColorScheme) => {
  return {
    /** antd 变量前缀 */
    antPrefixVar: "ant",
    /** antd 类名前缀 */
    antPrefixClass: "ant",
    /** antd 图标前缀 */
    antPrefixIcon: "anticon",

    /** 业务布局 z-index */
    bizLayoutZIndex: 100,
    /** 业务布局顶部栏高度 */
    bizLayoutHeader: 48,
    /** 业务布局标题栏高度 */
    bizLayoutTitle: 40,
    /** 业务布局边距 */
    bizLayoutGap: 12,
    /** 业务布局圆角 */
    bizLayoutRadius: 8,
    /** 业务布局边框颜色 */
    bizLayoutBorderColor: scheme === "dark" ? "#303030" : "#ebeef5",
  };
};

/** 获取主题变量 */
export const getThemeToken = (scheme?: ColorScheme) => {
  const token = {
    // #region 状态色

    /** 主题色 */
    colorPrimary: "#2176ff", // 默认值: #1677ff | #1668dc
    /** 链接色  */
    colorLink: "#2176ff", // 默认值: #1677ff | #1668dc
    /** 信息色 */
    colorInfo: "#24a7ff", // 默认值: #1677ff | #1668dc
    /** 成功色 */
    colorSuccess: "#36b257", // 默认值: #52c41a | #49aa19
    /** 警告色 */
    colorWarning: "#fbc504", // 默认值: #faad14 | #d89614
    /** 失败色 */
    colorError: "#db4539", // 默认值: #ff4d4f | #dc4446
    /** 默认色(该 token 实际并不存在) */
    colorDefault:
      scheme === "dark" ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)",

    // #endregion

    // #region 文本色

    /** 第一级文本色 */
    colorText: scheme === "dark" ? undefined : "#323340", // 默认值: rgba(0, 0, 0, 0.88) | rgba(255, 255, 255, 0.85)
    /** 第二级文本色 */
    colorTextSecondary: scheme === "dark" ? undefined : "#565866", // 默认值: rgba(0, 0, 0, 0.65) | rgba(255, 255, 255, 0.65)
    /** 第三级文本色 */
    colorTextTertiary: scheme === "dark" ? undefined : "#7d7f8c", // 默认值: rgba(0, 0, 0, 0.45) | rgba(255, 255, 255, 0.45)
    /** 第四级文本色 */
    colorTextQuaternary: scheme === "dark" ? undefined : "#a8Aab3", // 默认值: rgba(0, 0, 0, 0.25) | rgba(255, 255, 255, 0.25)

    // #endregion

    // #region 填充色

    /** 第一级填充色 */
    colorFill: "rgba(0, 0, 0, 0.15)",
    /** 第二级填充色 */
    colorFillSecondary: "rgba(0, 0, 0, 0.06)",
    /** 第三级填充色 */
    colorFillTertiary: "rgba(0, 0, 0, 0.04)",
    /** 第四级填充色 */
    colorFillQuaternary: "rgba(0, 0, 0, 0.02)",

    // #endregion

    // #region 边框色

    /** 第一级边框色 */
    colorBorder: "#d9d9d9",
    /** 第二级边框色 */
    colorBorderSecondary: "#f0f0f0",

    // #endregion

    // #region 边框圆角

    /** 基础组件的圆角大小 */
    borderRadius: 4, // 默认值: 6
    /** LG号圆角，用于组件中的一些大圆角 */
    borderRadiusLG: 8,
    /** SM号圆角，用于组件小尺寸下的圆角 */
    borderRadiusSM: 4,
    /** XS号圆角，用于组件中的一些小圆角 */
    borderRadiusXS: 2,
    /** 外部圆角 */
    borderRadiusOuter: 4,

    // #endregion

    // #region 背景色

    /** 页面布局背景色 */
    colorBgLayout: scheme === "dark" ? undefined : "#eff2F7", // 默认值: #f5f5f5 | #000000
    /** 组件容器背景色 */
    colorBgContainer: "#ffffff",
    /** 浮层容器背景色 */
    colorBgElevated: "#ffffff",
    /** 浮层蒙层背景色 */
    colorBgMask: "rgba(0, 0, 0, 0.45)",

    // #endregion

    // #region 主题色的激活色和悬浮色

    /** 主题色的背景色(激活色) */
    colorPrimaryBg: "#e6f4ff",
    /** 主题色的背景悬浮色 */
    colorPrimaryBgHover: "#bae0ff",
    /** 主题色的边框色(激活色) */
    colorPrimaryBorder: "#91caff",
    /** 主题色的边框悬浮色 */
    colorPrimaryBorderHover: "#69b1ff",

    // #endregion

    // #region 阴影样式

    /** 第一级阴影样式 */
    boxShadow:
      "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    /** 第二级阴影样式 */
    boxShadowSecondary:
      "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
    /** 第三级阴影样式 */
    boxShadowTertiary:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",

    // #endregion
  } satisfies ThemeConfig["token"] & {
    colorDefault?: string;
  };

  const validToken = Object.keys(token).reduce((acc, key) => {
    const value = (token as any)[key];
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {} as any);

  return validToken as typeof token;
};

/** 获取主题配置  */
export const getThemeConfig = (scheme?: ColorScheme) => {
  const cfg = getStyleConfig(scheme);
  const token = getThemeToken(scheme);

  return {
    token,
    cssVar: {
      prefix: cfg.antPrefixVar,
    },
  } satisfies ThemeConfig;
};

/** 获取 ConfigProvider 配置  */
export const getConfigProviderProps = (scheme?: ColorScheme) => {
  const cfg = getStyleConfig(scheme);
  const theme = getThemeConfig(scheme);

  return {
    theme,
    prefixCls: cfg.antPrefixClass,
    iconPrefixCls: cfg.antPrefixIcon,
  } satisfies ConfigProviderProps;
};

// #endregion

// #region light 配置

/** 样式配置 */
export const styleConfig = getStyleConfig();

/** 主题变量 */
export const themeToken = getThemeToken();

/** 主题配置  */
export const themeConfig = getThemeConfig();

/** 默认 ConfigProvider 配置  */
export const defaultConfigProviderProps = getConfigProviderProps();

// #endregion

// #region 主题切换

/** 属性名称 */
export const attributeName = "data-theme";

/** 查询主题属性 */
export const queryThemeAttribute = () => {
  const htmlElem = document.documentElement;
  const attrValue = htmlElem.getAttribute(attributeName);
  return attrValue;
};

/** 更新主题属性 */
export const updateThemeAttribute = (attrValue?: ColorScheme) => {
  const htmlElem = document.documentElement;
  if (attrValue) {
    htmlElem.setAttribute(attributeName, attrValue);
  } else {
    htmlElem.removeAttribute(attributeName);
  }
};

/** 监听浏览器主题变化，并返回取消监听函数。 */
export const listenBrowserTheme = (
  callback: (value: ColorScheme) => void,
  options?: {
    /** 立即触发一次 */
    immediate?: boolean;
  },
) => {
  const { immediate = true } = options || {};

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  if (immediate) {
    const value = media.matches ? "dark" : "light";
    callback(value);
  }

  const handleChange = (event: MediaQueryListEvent) => {
    const value = event.matches ? "dark" : "light";
    callback(value);
  };
  media.addEventListener("change", handleChange);

  return () => {
    media.removeEventListener("change", handleChange);
  };
};

// #endregion
