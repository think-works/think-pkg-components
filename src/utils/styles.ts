/**
 * antd 变量前缀
 */
export const antPrefixVar = String(
  import.meta.env.VITE_ANTD_PREFIX_VAR || "ant",
);

/**
 * antd 类名前缀
 */
export const antPrefixClass = String(
  import.meta.env.VITE_ANTD_PREFIX_CLASS || "ant",
);

/**
 * antd 图标前缀
 */
export const antPrefixIcon = String(
  import.meta.env.VITE_ANTD_PREFIX_ICON || "anticon",
);

/**
 * 业务布局 z-index
 */
export const bizLayoutZIndex = Number(
  import.meta.env.VITE_BIZ_LAYOUT_ZINDEX || 100,
);

/**
 * 业务布局顶部栏高度
 */
export const bizLayoutHeader = Number(
  import.meta.env.VITE_BIZ_LAYOUT_HEADER || 48,
);
