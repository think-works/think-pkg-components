import { useLocale as useAntdLocale } from "antd/es/locale";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getLocale, Language, Locale } from "./locale";

export * from "./hooks";

export type ConfigContextType = {
  /** 预期使用的语言 */
  lang?: Language;
  /** 实际使用的本地化资源 */
  locale?: Locale;
};

/**
 * 配置上下文
 */
export const ConfigContext = createContext<ConfigContextType>({});

/**
 * 配置上下文 hook
 */
export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  return context;
};

export type ConfigProviderProps = {
  children?: React.ReactNode;
} & ConfigContextType;

/**
 * 配置上下文 Provider
 */
export const ConfigProvider = (props: ConfigProviderProps) => {
  // 默认为 Antd 中使用的语言
  const [_, antdLang] = useAntdLocale("global");
  const { children, lang = antdLang, locale } = props;

  const [context, setContext] = useState<ConfigContextType>({});
  const innerLocale = useMemo(() => locale || getLocale(lang), [lang, locale]);

  useEffect(() => {
    setContext({
      lang,
      locale: innerLocale,
    });
  }, [lang, innerLocale]);

  return (
    <ConfigContext.Provider value={context}>{children}</ConfigContext.Provider>
  );
};

export default ConfigProvider;
