/**
 * 注意：
 * 除默认语言外，其他语言都应指定类型，以免缺失翻译内容。
 *
 * ```
 * import { Locale } from "..";
 * const locale: Locale = {
 *   lang: "en-US",
 * };
 * ```
 */
import { merge } from "lodash-es";
import { lookupLangTag } from "@/common/lang";
import { LiteralUnion } from "@/utils/types";
import zhCN from "./locale/zh-CN";

const dftLanguage = "zh-CN";
const dftLocale = zhCN as typeof zhCN;

/** 支持的语言 */
type InnerLanguage = keyof typeof locales;

/** 支持的语言 */
export type Language = LiteralUnion<InnerLanguage>;

/** 本地化资源 */
export type Locale = {
  lang: Language;
} & Omit<typeof dftLocale, "lang">;

/** 本地化资源 */
const locales = {
  // 中文
  zh: dftLocale as typeof dftLocale,
  "zh-CN": dftLocale as typeof dftLocale,
  // 英文
  en: async () => await import("./locale/en-US"),
  "en-US": async () => await import("./locale/en-US"),
} as const;

/** 默认语言 */
export const defaultLanguage: string = dftLanguage;

/** 默认本地化资源 */
export const defaultLocale: Locale = dftLocale;

/** 支持的语言 */
export const languages = Object.keys(locales) as InnerLanguage[];

/** 获取本地化资源 */
export const getLocale = async (language?: Language): Promise<Locale> => {
  // 默认语言
  if (!language || language === defaultLanguage) {
    return defaultLocale;
  }

  // 不支持的语言
  const langTag = lookupLangTag(languages, language);
  if (!langTag) {
    return defaultLocale;
  }

  // 动态加载语言
  let langLocale: Locale;
  const GetLocale = locales[langTag as InnerLanguage];
  if (typeof GetLocale === "function") {
    langLocale = (await GetLocale()).default;
  } else {
    langLocale = GetLocale;
  }

  // 避免翻译缺失
  return merge({}, defaultLocale, langLocale);
};
