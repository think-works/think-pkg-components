import { App as AntdApp, ConfigProvider as AntdConfigProvider } from "antd";
import dayjs from "dayjs";
import { StrictMode, useEffect, useMemo, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { lang, themes } from "@/components";
import { router } from "./router";
import "./index.less";
import zhCN from "antd/es/locale/zh_CN";
import "dayjs/locale/zh-cn";

// import enUS from "antd/es/locale/en_US";
// import "dayjs/locale/en";

const defaultAntdLocale = zhCN;
const defaultDayjsLang = "zh-CN";

dayjs.locale(defaultDayjsLang);

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
    dftI18n !== "auto" ? dftI18n : undefined,
  );

  const [antdLocale, setAntdLocale] = useState(defaultAntdLocale);

  // 国际化配置
  useEffect(() => {
    /**
     * antd / dayjs 默认英文而产品默认中文。
     * 本质上打包后已经内置了中文和英文语言包。
     * 此处的动态加载用于演示加载任意的语言包。
     */
    if (i18n) {
      if (lang.lookupLangTag(["en"], i18n)) {
        // setAntdLocale(enUS);
        // dayjs.locale("en");

        import("antd/es/locale/en_US").then((module) => {
          setAntdLocale(module.default);
        });
        import("dayjs/locale/en").then(() => {
          dayjs.locale("en");
        });
        return;
      }
    }

    setAntdLocale(defaultAntdLocale);
    dayjs.locale(defaultDayjsLang);
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
    dftScheme !== "auto" ? dftScheme : undefined,
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
      <AntdConfigProvider locale={antdLocale} {...themeConfig}>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </AntdConfigProvider>
    </StrictMode>
  );
};

export default Demo;
