import {
  App as AntdApp,
  ConfigProvider as AntdConfigProvider,
  ConfigProviderProps as AntdConfigProviderProps,
} from "antd";
import enUS from "antd/es/locale/en_US";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import { StrictMode, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { lang, themes } from "@/components";
import { router } from "./router";
import "dayjs/locale/en";
import "dayjs/locale/zh-cn";
import "./index.less";

const zhLang = "zh-CN";
const enLang = "en-US";

// const dftI18n: string = enLang;
const dftI18n = lang.detectLangTag({ browser: true });

const antdLocale = dftI18n === zhLang ? zhCN : enUS;
const dayjsLocale = dftI18n === zhLang ? zhLang : enLang;
// const componentsLocale = dftI18n === zhLang ? zhLang : enLang;

dayjs.locale(dayjsLocale);

const dftScheme = themes.detectThemeScheme({
  metaElement: true,
  matchMedia: true,
});

const diff = {
  theme: {
    token: {
      // 主题色切换
      // colorPrimary: "#CC3232",
      // colorLink: "#CC3232",
    },
  },
} satisfies AntdConfigProviderProps;

const dftConfig = themes.getConfigProviderProps(dftScheme, diff);

const Demo = () => {
  const [config, setConfig] = useState(dftConfig);

  useEffect(() => {
    return themes.listenBrowserTheme((value) => {
      const cfg = themes.getConfigProviderProps(value, diff);
      setConfig(cfg);

      themes.updateThemeAttribute(value);
      themes.updateThemeStorage(value);
    });
  }, []);

  return (
    <StrictMode>
      <AntdConfigProvider locale={antdLocale} {...config}>
        <AntdApp>
          {/* 未配置 ConfigProvider 时尝试使用 AntdConfigProvider 中的配置 */}
          {/* <ConfigProvider lang={componentsLocale}> */}
          <RouterProvider router={router} />
          {/* </ConfigProvider> */}
        </AntdApp>
      </AntdConfigProvider>
    </StrictMode>
  );
};

export default Demo;
