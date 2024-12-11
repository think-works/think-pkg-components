/**
 * 样式配置(与 @/styles/basic.less 保持一致)
 */
export const styleConfig = {
  antPrefixVar: "ant",
  antPrefixClass: "ant",
  antPrefixIcon: "anticon",
  bizLayoutZIndex: 100,
  bizLayoutHeader: 48,
};

/**
 * 主题变量
 */
export const themeToken = {
  /** 主题色 */
  colorPrimary: "#2176FF",
  /** 链接色  */
  colorLink: "#2176FF",
  /** 信息色 */
  colorInfo: "#24A7Ff",
  /** 成功色 */
  colorSuccess: "#36b257",
  /** 警告色 */
  colorWarning: "#fbc504",
  /** 失败色 */
  colorError: "#db4539",
  /** 默认色(该 token 不存在，使用 colorTextQuaternary 作为默认状态色) */
  colorDefault: "rgba(0, 0, 0, 0.25)",
};

/**
 * 主题配置
 */
export const themeConfig = {
  token: themeToken,
  cssVar: {
    prefix: styleConfig.antPrefixVar,
  },
};

/**
 * 默认 ConfigProvider 配置
 */
export const defaultConfigProviderProps = {
  prefixCls: styleConfig.antPrefixClass,
  iconPrefixCls: styleConfig.antPrefixIcon,
  theme: themeConfig,
};
