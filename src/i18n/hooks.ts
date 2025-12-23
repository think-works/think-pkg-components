import { useLocale as useAntdLocale } from "antd/es/locale";
import { useCallback, useEffect, useState } from "react";
import { findLocaleText, formatLocaleText } from "@/common/lang";
import { useConfigContext } from "@/components/ConfigProvider";
import { ObjectPaths } from "@/utils/types";
import { defaultLanguage, defaultLocale, getLocale, Locale } from "./index";

export type ComponentsLocale = {
  /** 预期使用的语言 */
  lang: string;
  /** 实际使用的本地化资源 */
  locale: Locale;
  /** 查找本地化资源文本 */
  findLocaleText: (
    paths: ObjectPaths<Locale>,
    vars?: Record<string, any>,
  ) => ReturnType<typeof findLocaleText>;
  /** 格式化本地化资源文本 */
  formatLocaleText: typeof formatLocaleText;
};

/**
 * 获取组件库的本地化资源
 */
export const getComponentsLocale = async (
  language?: string,
  locale?: Locale,
): Promise<ComponentsLocale> => {
  const innerLang = language || defaultLanguage;
  const innerLocale = locale || (await getLocale(innerLang));

  const innerFindLocaleText = (
    paths: ObjectPaths<Locale>,
    vars?: Record<string, any>,
  ) => findLocaleText(innerLocale, paths, vars);

  return {
    lang: innerLang,
    locale: innerLocale,
    findLocaleText: innerFindLocaleText,
    formatLocaleText,
  };
};

/**
 * 使用组件库的本地化资源
 */
export const useComponentsLocale = (): ComponentsLocale => {
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
    lang: innerLang,
    locale: innerLocale,
    findLocaleText: innerFindLocaleText,
    formatLocaleText,
  };
};
