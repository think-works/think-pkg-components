import { useLocale as useAntdLocale } from "antd/es/locale";
import { createContext, useContext, useEffect, useState } from "react";
import {
  defaultLanguage,
  defaultLocale,
  getLocale,
  Language,
  Locale,
} from "@/i18n";

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
  const { children, lang: propsLang, locale: propsLocale } = props;

  const [context, setContext] = useState<ConfigContextType>({});

  const innerLang = propsLang || antdLang || defaultLanguage;
  const [innerLocale, setInnerLocale] = useState(propsLocale || defaultLocale);

  useEffect(() => {
    setContext({
      lang: innerLang,
      locale: innerLocale,
    });
  }, [innerLang, innerLocale]);

  useEffect(() => {
    if (propsLocale) {
      return;
    }

    getLocale(innerLang).then((loadedLocale) => {
      setInnerLocale(loadedLocale);
    });
  }, [innerLang, propsLocale]);

  return (
    <ConfigContext.Provider value={context}>{children}</ConfigContext.Provider>
  );
};

export default ConfigProvider;
