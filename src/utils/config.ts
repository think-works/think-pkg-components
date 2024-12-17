const NODE_ENV = process.env.NODE_ENV;
const APP_NAME = String(import.meta.env.VITE_APP_NAME || "APP");
const APP_VERSION = String(import.meta.env.VITE_APP_VERSION || "0.0.0");
const PRODUCT_NAME = String(import.meta.env.VITE_PRODUCT_NAME || "");
const API_BASE = String(import.meta.env.VITE_API_BASE || "/");

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
 * KEY 前缀(无特殊字符的应用名称)
 */
export const keyPrefix = APP_NAME.replaceAll("@", "").replaceAll("/", "_");

/**
 * 产品名称
 */
export const productName = PRODUCT_NAME;

/**
 * API 基础路径
 */
export const apiBase = API_BASE.endsWith("/") ? API_BASE : `${API_BASE}/`;
