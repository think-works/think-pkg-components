import { App as AntdApp, ConfigProvider as AntdConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import { StrictMode, useEffect, useMemo, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { lang, themes } from "@/components";
import { router } from "./router";
import "dayjs/locale/en";
import "dayjs/locale/zh-cn";
import "./index.less";

// 平台主题色
const platformColor = "#CC3232";

// 检查默认国际化语言
const dftI18n = lang.detectLangTag({ browser: true });

// 检查默认主题方案
const dftScheme = themes.detectThemeScheme({
  metaElement: true,
  matchMedia: true,
});

const Demo = () => {
  // #region 国际化配置

  const [i18n, setI18n] = useState<lang.LangTag | undefined>(
    dftI18n === "auto" ? undefined : dftI18n,
  );

  // 国际化配置
  const localeConfig = useMemo(() => {
    if (i18n) {
      const isEnglish = lang.lookupLangTag(["en"], i18n);
      if (isEnglish) {
        // 使用英文
        dayjs.locale("en");
        return {
          locale: enUS,
        };
      }
    }

    // 默认使用中文
    dayjs.locale("zh-CN");
    return {
      locale: zhCN,
    };
  }, [i18n]);

  // 监听浏览器语言切换
  useEffect(() => {
    return lang.listenBrowserLang(
      (value) => {
        setI18n?.(value);
      },
      { immediate: true },
    );
  }, []);

  // #endregion

  // #region 主题配置

  const [theme, setTheme] = useState<themes.ColorScheme | undefined>(
    dftScheme === "auto" ? undefined : dftScheme,
  );

  // 主题配置
  const themeConfig = useMemo(
    () =>
      themes.getConfigProviderProps(
        theme,
        platformColor
          ? {
              theme: {
                token: {
                  colorPrimary: platformColor,
                  colorLink: platformColor,
                },
              },
            }
          : undefined,
      ),
    [theme],
  );

  // 主题变更时更新属性
  useEffect(() => {
    themes.updateThemeAttribute(theme);
  }, [theme]);

  // 监听浏览器主题切换
  useEffect(() => {
    return themes.listenBrowserTheme(
      (value) => {
        setTheme(value);
      },
      { immediate: true },
    );
  }, []);

  // #endregion

  return (
    <StrictMode>
      <AntdConfigProvider {...localeConfig} {...themeConfig}>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </AntdConfigProvider>
    </StrictMode>
  );
};

export default Demo;
