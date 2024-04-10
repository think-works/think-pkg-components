import * as styles from "@/utils/styles";

/**
 * 样式配置
 */
export const styleConfig = styles;

/**
 * 主题变量
 */
export const themeToken = {
  /** 主题色 */
  colorPrimary: "#294bf5",
  /** 链接色  */
  colorLink: "#294bf5",
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
    prefix: styles.antPrefixVar,
  },
};

/**
 * 默认 ConfigProvider 配置
 */
export const defaultConfigProviderProps = {
  prefixCls: styles.antPrefixClass,
  iconPrefixCls: styles.antPrefixIcon,
  theme: themeConfig,
};
