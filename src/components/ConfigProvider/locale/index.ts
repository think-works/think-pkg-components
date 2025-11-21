/**
 * 注意：
 * 除默认语言外，其他语言都应指定类型，以免缺失翻译内容。
 *
 * ```
 * import { Locale } from ".";
 * const locale: Locale = {
 *   lang: "en-US",
 * };
 * ```
 */
import { merge } from "lodash-es";
import { lookupLangTag } from "@/common/lang";
import { LiteralUnion } from "@/utils/types";
import enUS from "./en-US";
import zhCN from "./zh-CN";

/** 支持的语言 */
export type Language = LiteralUnion<keyof typeof locales>;

/** 本地化资源 */
export type Locale = {
  lang: Language;
} & Omit<typeof defaultLocale, "lang">;

/** 默认语言 */
export const defaultLanguage = "zh-CN";

/** 默认本地化资源 */
export const defaultLocale = zhCN;

/** 本地化资源 */
export const locales = {
  zh: zhCN, // 中文兜底
  "zh-CN": zhCN,
  en: enUS, // 英文兜底
  "en-US": enUS,
} as const;

/** 支持的语言 */
export const languages = Object.keys(locales) as (keyof typeof locales)[];

/** 获取本地化资源 */
export const getLocale = (language?: Language): Locale => {
  if (!language || language === defaultLanguage) {
    return defaultLocale;
  }

  const langTag = lookupLangTag(languages, language);
  if (!langTag) {
    return defaultLocale;
  }

  const langLocale = (locales as Record<string, Locale>)[langTag];

  return merge({}, defaultLocale, langLocale);
};
