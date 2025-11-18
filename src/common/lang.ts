import { deleteLocal, queryLocal, updateLocal } from "@/utils/storage";

/** 修正语言标记 */
export const normalizeLangTag = (supportList: string[], locale: string) => {
  const list = supportList.find((item) => {
    const lowerItem = item.toLowerCase();
    const lowerLocale = locale.toLowerCase();

    // 完全匹配
    if (lowerItem === lowerLocale) {
      return true;
    }

    // 部分匹配
    const itemArr = lowerItem.split("-");
    const localeArr = lowerLocale.split("-");

    if (itemArr[0] === localeArr[0]) {
      // 第一位相同
      if (itemArr.length === 1 || localeArr.length === 1) {
        // 没有第二位
        return true;
      } else if (itemArr[1] === localeArr[1]) {
        // 第二位相同
        return true;
      }
    }
  });

  return list;
};

// #region 语言查询切换

/** 语言属性名称 */
export const langAttributeName = "lang";

/** 查询语言属性 */
export const queryLangAttribute = (attrName = langAttributeName) => {
  const htmlElem = document.documentElement;
  const attrValue = htmlElem.getAttribute(attrName);
  return attrValue;
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
  return storageValue;
};

/** 更新语言存储 */
export const updateLangStorage = (value?: string, key = langStorageKey) => {
  if (value) {
    updateLocal(key, value);
  } else {
    deleteLocal(key);
  }
};

/** 查询浏览器语言 */
export const queryBrowserLanguage = () => {
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
    const browserValue = queryBrowserLanguage();
    if (browserValue) {
      return browserValue;
    }
  }
};

// #endregion
