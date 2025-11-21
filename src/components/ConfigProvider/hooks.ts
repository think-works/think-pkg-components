import { useConfigContext } from ".";
import { useLocale as useAntdLocale } from "antd/es/locale";
import { useCallback, useMemo } from "react";
import { findLocaleText, replaceTextVars } from "@/common/lang";
import { getLocale, Locale } from "@/i18n";
import { ObjectPaths } from "@/utils/types";

/**
 * 使用组件库的本地化资源
 */
export const useComponentsLocale = () => {
  // 默认为 Antd 中使用的语言
  const [_, antdLang] = useAntdLocale("global");
  const { lang: contextLang, locale: contextLocale } = useConfigContext();

  const innerLang = useMemo(
    () => contextLang || antdLang,
    [antdLang, contextLang],
  );
  const innerLocale = useMemo(
    () => contextLocale || getLocale(innerLang),
    [contextLocale, innerLang],
  );
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
