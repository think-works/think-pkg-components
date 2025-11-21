import { lookup } from "bcp-47-match";
import { deleteLocal, queryLocal, updateLocal } from "@/utils/storage";

// #region 本地化资源

/** 查找语言标记 */
export const lookupLangTag = (languages: string[], language: string) => {
  /**
   * https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag
   * https://www.w3.org/International/articles/language-tags/
   * https://www.w3.org/International/questions/qa-choosing-language-tags
   */
  return lookup(languages, language);
};

/** 查找本地化资源文本 */
export const findLocaleText = (
  /** 本地化资源 */
  locale: Record<string, any>,
  /** 本地化资源路径(以 `.` 分割) */
  paths: string,
  /** 替换文本中的变量(以 `${var}` 占位) */
  vars?: Record<string, any>,
) => {
  // 分割路径
  const text = paths
    .split(".")
    .reduce((o, k) => o?.[k], locale)
    ?.toString() as string | undefined;

  // 替换变量
  if (text && vars) {
    return replaceTextVars(text, vars);
  }

  return text;
};

/** 替换文本变量 */
export const replaceTextVars = (
  /** 文本 */
  text: string,
  /** 变量(以 `${var}` 占位) */
  vars: Record<string, any>,
) => {
  // 替换占位
  return text.replace(/\$\{(\w+)\}/g, (_, k) => vars[k] ?? "");
};

// #endregion

// #region 语言查询切换

/** 语言属性名称 */
export const langAttributeName = "lang";

/** 查询语言属性 */
export const queryLangAttribute = (attrName = langAttributeName) => {
  const htmlElem = document.documentElement;
  const attrValue = htmlElem.getAttribute(attrName);
  if (attrValue) {
    return attrValue;
  }
};

/** 更新语言属性 */
export const updateLangAttribute = (
  attrValue?: string,
  attrName = langAttributeName,
) => {
  const htmlElem = document.documentElement;
  if (attrValue) {
    htmlElem.setAttribute(attrName, attrValue);
  } else {
    htmlElem.removeAttribute(attrName);
  }
};

/** 语言存储 key */
export const langStorageKey = "lang";

/** 查询语言存储 */
export const queryLangStorage = (key = langStorageKey) => {
  const storageValue = queryLocal(key);
  if (storageValue) {
    return storageValue as string;
  }
};

/** 更新语言存储 */
export const updateLangStorage = (value?: string, key = langStorageKey) => {
  if (value) {
    updateLocal(key, value);
  } else {
    deleteLocal(key);
  }
};

/** 查询浏览器语言(一定会返回) */
export const queryBrowserLang = () => {
  return navigator.language;
};

/** 侦测语言标记 */
export const detectLangTag = (options?: {
  /** 语言存储 key */
  langStorageKey?: false | string;
  /** 语言属性名称 */
  langAttributeName?: false | string;
  /** 检查浏览器 */
  browser?: boolean;
}) => {
  const {
    langStorageKey: key = langStorageKey,
    langAttributeName: name = langAttributeName,
    browser,
  } = options || {};

  // 检查存储值
  if (key) {
    const storageValue = queryLangStorage(key);
    if (storageValue) {
      return storageValue;
    }
  }

  // 检查属性值
  if (name) {
    const attrValue = queryLangAttribute(name);
    if (attrValue) {
      return attrValue;
    }
  }

  if (browser) {
    const browserValue = queryBrowserLang();
    if (browserValue) {
      return browserValue;
    }
  }
};

/** 监听浏览器语言变化，并返回取消监听函数。 */
export const listenBrowserLang = (
  callback: (value: string) => void,
  options?: {
    /** 立即触发一次 */
    immediate?: boolean;
  },
) => {
  const { immediate } = options || {};

  if (immediate) {
    const value = navigator.language;
    callback(value);
  }

  const handleChange = () => {
    const value = navigator.language;
    callback(value);
  };
  window.addEventListener("languagechange", handleChange);

  return () => {
    window.removeEventListener("languagechange", handleChange);
  };
};

// #endregion
