import { useLocale as useAntdLocale } from "antd/es/locale";
import { useCallback, useEffect, useState } from "react";
import { findLocaleText, replaceTextVars } from "@/common/lang";
import { useConfigContext } from "@/components/ConfigProvider";
import { ObjectPaths } from "@/utils/types";
import { defaultLanguage, defaultLocale, getLocale, Locale } from "./index";

/**
 * 获取组件库的本地化资源
 */
export const getComponentsLocale = async (language?: string) => {
  const innerLang = language || defaultLanguage;
  const innerLocale = await getLocale(innerLang);

  const innerFindLocaleText = (
    paths: ObjectPaths<Locale>,
    vars?: Record<string, any>,
  ) => findLocaleText(innerLocale, paths, vars);

  return {
    /** 预期使用的语言 */
    lang: innerLang,
    /** 实际使用的本地化资源 */
    locale: innerLocale,
    /** 查找本地化资源文本 */
    findLocaleText: innerFindLocaleText,
    /** 替换文本变量 */
    replaceTextVars: replaceTextVars,
  };
};

/**
 * 使用组件库的本地化资源
 */
export const useComponentsLocale = () => {
  // 默认为 Antd 中使用的语言
  const [_, antdLang] = useAntdLocale("global");
  const { lang: contextLang, locale: contextLocale } = useConfigContext();

  const innerLang = contextLang || antdLang || defaultLanguage;
  const [innerLocale, setInnerLocale] = useState(
    contextLocale || defaultLocale,
  );

  useEffect(() => {
    if (contextLocale) {
      return;
    }

    getLocale(innerLang).then((loadedLocale) => {
      setInnerLocale(loadedLocale);
    });
  }, [contextLocale, innerLang]);

  const innerFindLocaleText = useCallback(
    (paths: ObjectPaths<Locale>, vars?: Record<string, any>) =>
      findLocaleText(innerLocale, paths, vars),
    [innerLocale],
  );

  return {
    /** 预期使用的语言 */
    lang: innerLang,
    /** 实际使用的本地化资源 */
    locale: innerLocale,
    /** 查找本地化资源文本 */
    findLocaleText: innerFindLocaleText,
    /** 替换文本变量 */
    replaceTextVars,
  };
};
