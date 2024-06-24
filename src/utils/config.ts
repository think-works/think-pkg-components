const NODE_ENV = process.env.NODE_ENV;
const APP_NAME = String(import.meta.env.VITE_APP_NAME || "APP");
const APP_VERSION = String(import.meta.env.VITE_APP_VERSION || "0.0.0");

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
