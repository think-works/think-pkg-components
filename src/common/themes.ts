import { ConfigProviderProps, theme, ThemeConfig } from "antd";
import { merge } from "lodash-es";
import { deleteStorage, queryStorage, updateStorage } from "@/utils/tools";

/** 颜色方案 */
export const colorSchemes = ["light", "dark"] as const;

/** 颜色方案 */
export type ColorScheme = (typeof colorSchemes)[number];

// #region 颜色方案配置

/** 获取样式配置 */
export const getStyleConfig = () => {
  /**
   * 注意：
   * 需与 @/styles/basic.less 中的 样式配置 保持一致。
   */
  const cfg = {
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
  };

  return cfg;
};

/** 获取主题变量 */
export const getThemeToken = (
  scheme?: ColorScheme,
  diff?: ThemeConfig["token"] & {
    colorDefault?: string;
  },
) => {
  const token = {
    // #region 状态色

    /** 伪造的默认色(该 token 实际并不存在) */
    colorDefault: "rgba(128, 128, 128, 0.5)",
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

    // #endregion

    // #region 文本色

    /** 第一级文本色 */
    colorText: scheme === "dark" ? "rgba(255, 255, 255, 0.85)" : "#323340", // 默认值: rgba(0, 0, 0, 0.88) | rgba(255, 255, 255, 0.85)
    /** 第二级文本色 */
    colorTextSecondary:
      scheme === "dark" ? "rgba(255, 255, 255, 0.65)" : "#565866", // 默认值: rgba(0, 0, 0, 0.65) | rgba(255, 255, 255, 0.65)
    /** 第三级文本色 */
    colorTextTertiary:
      scheme === "dark" ? "rgba(255, 255, 255, 0.45)" : "#7d7f8c", // 默认值: rgba(0, 0, 0, 0.45) | rgba(255, 255, 255, 0.45)
    /** 第四级文本色 */
    colorTextQuaternary:
      scheme === "dark" ? "rgba(255, 255, 255, 0.25)" : "#a8Aab3", // 默认值: rgba(0, 0, 0, 0.25) | rgba(255, 255, 255, 0.25)

    // #endregion

    // #region 背景色

    /** 页面布局背景色 */
    colorBgLayout: scheme === "dark" ? "#000000" : "#eff2F7", // 默认值: #f5f5f5 | #000000

    // #endregion

    // #region 边框圆角

    /** 基础组件的圆角大小 */
    borderRadius: 4, // 默认值: 6

    // #endregion
  } satisfies ThemeConfig["token"] & {
    colorDefault?: string;
  };

  return diff ? merge({}, token, diff) : token;
};

/** 获取组件变量  */
export const getComponentsToken = (
  scheme?: ColorScheme,
  diff?: ThemeConfig["components"],
) => {
  const components = {
    Table: {
      /** 表头背景 */
      headerBg: scheme === "dark" ? "#1d1d1d" : "#f5f7fa", // 默认值: #fafafa | #1d1d1d
    },
  } satisfies ThemeConfig["components"];

  return diff ? merge({}, components, diff) : components;
};

/** 获取主题配置  */
export const getThemeConfig = (scheme?: ColorScheme, diff?: ThemeConfig) => {
  const cfg = getStyleConfig();
  const token = getThemeToken(scheme, diff?.token);
  const components = getComponentsToken(scheme, diff?.components);
  const algorithm =
    scheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm;

  const result = {
    token,
    components,
    algorithm,
    cssVar: {
      prefix: cfg.antPrefixVar,
    },
  } satisfies ThemeConfig;

  return diff ? merge({}, result, diff) : result;
};

/** 获取 ConfigProvider 配置  */
export const getConfigProviderProps = (
  scheme?: ColorScheme,
  diff?: ConfigProviderProps,
) => {
  const cfg = getStyleConfig();
  const theme = getThemeConfig(scheme, diff?.theme);

  const result = {
    theme,
    prefixCls: cfg.antPrefixClass,
    iconPrefixCls: cfg.antPrefixIcon,
  } satisfies ConfigProviderProps;

  return diff ? merge({}, result, diff) : result;
};

// #endregion

// #region light 配置

/** 样式配置 */
export const styleConfig = getStyleConfig();

/** 主题变量 */
export const themeToken = getThemeToken();

/** 组件变量 */
export const componentsToken = getComponentsToken();

/** 主题配置  */
export const themeConfig = getThemeConfig();

/** ConfigProvider 配置  */
export const configProviderProps = getConfigProviderProps();

/** 默认 ConfigProvider 配置 @deprecated 请使用 `configProviderProps`  */
export const defaultConfigProviderProps = configProviderProps;

// #endregion

// #region 主题属性存储

/** 属性名称 */
export const attributeName = "data-theme";

/** 查询主题属性 */
export const queryThemeAttribute = (attrName = attributeName) => {
  const htmlElem = document.documentElement;
  const attrValue = htmlElem.getAttribute(attrName);

  if (colorSchemes.includes(attrValue as any)) {
    return attrValue as ColorScheme;
  }
};

/** 更新主题属性 */
export const updateThemeAttribute = (
  attrValue?: ColorScheme,
  attrName = attributeName,
) => {
  const htmlElem = document.documentElement;
  if (attrValue) {
    htmlElem.setAttribute(attrName, attrValue);
  } else {
    htmlElem.removeAttribute(attrName);
  }
};

/** 存储 key */
export const storageKey = "theme";

/** 查询主题存储 */
export const queryThemeStorage = (key = storageKey) => {
  const storageValue = queryStorage(key);
  if (colorSchemes.includes(storageValue as any)) {
    return storageValue as ColorScheme;
  }
};

/** 更新主题存储 */
export const updateThemeStorage = (value?: ColorScheme, key = storageKey) => {
  if (value) {
    updateStorage(key, value);
  } else {
    deleteStorage(key);
  }
};

// #endregion

// #region 主题侦测切换

/** 监听浏览器主题变化，并返回取消监听函数。 */
export const listenBrowserTheme = (
  callback: (value: ColorScheme) => void,
  options?: {
    /** 立即触发一次 */
    immediate?: boolean;
  },
) => {
  const { immediate } = options || {};

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

/** 侦测主题方案 */
export const detectThemeScheme = (options?: {
  /** 属性名称 */
  attributeName?: string;
  /** 存储 key */
  storageKey?: string;
  /** 检查 meta 元素 */
  metaElement?: boolean;
  /** 媒体查询 */
  matchMedia?: boolean;
  /** 同步更新存储值和属性值 */
  syncTheme?: boolean;
}) => {
  const {
    attributeName: name = attributeName,
    storageKey: key = storageKey,
    metaElement,
    matchMedia,
    syncTheme,
  } = options || {};

  // 检查存储值
  if (key) {
    const storageValue = queryThemeStorage(key);
    if (storageValue) {
      // 更新属性值
      if (syncTheme && name) {
        updateThemeAttribute(storageValue, name);
      }
      return storageValue;
    }
  }

  // 检查属性值
  if (name) {
    const attrValue = queryThemeAttribute(name);
    if (attrValue) {
      // 更新存储值
      if (syncTheme && key) {
        updateThemeStorage(attrValue, key);
      }
      return attrValue;
    }
  }

  // 检查元信息
  if (metaElement) {
    const metaTheme = document.querySelector("meta[name='color-scheme']");
    const metaValue = metaTheme
      ?.getAttribute("content")
      ?.split(" ")
      ?.filter((item) =>
        colorSchemes.includes(item as any),
      )?.[0] as ColorScheme;

    if (metaValue) {
      // 更新属性值和存储值
      if (syncTheme && name) {
        updateThemeAttribute(metaValue, name);
      }
      if (syncTheme && key) {
        updateThemeStorage(metaValue, key);
      }
      return metaValue;
    }
  }

  // 检查媒体查询
  if (matchMedia) {
    const mediaTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const mediaValue = mediaTheme.matches ? "dark" : "light";

    if (mediaValue) {
      // 更新属性值和存储值
      if (syncTheme && name) {
        updateThemeAttribute(mediaValue, name);
      }
      if (syncTheme && key) {
        updateThemeStorage(mediaValue, key);
      }
      return mediaValue;
    }
  }
};

// #endregion
