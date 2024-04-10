const NODE_ENV = process.env.NODE_ENV;
const APP_NAME = __APP_NAME__ || "APP";
const APP_VERSION = __APP_VERSION__ || "0.0.0";

/**
 * 生产模式
 */
export const isProd = NODE_ENV === "production";

/**
 * 应用名称
 */
export const appName = APP_NAME;

/**
 * 应用版本
 */
export const appVersion = APP_VERSION;

/**
 * KEY 前缀
 */
export const keyPrefix = APP_NAME.replaceAll("@", "").replaceAll("/", "_");
