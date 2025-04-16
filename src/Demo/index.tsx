import { App as AntdApp, ConfigProvider, ConfigProviderProps } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import { StrictMode, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { themes } from "@/components";
import { router } from "./router";
import "dayjs/locale/zh-cn";
import "./index.less";

dayjs.locale("zh-CN");

const dftScheme = themes.detectThemeScheme({
  metaElement: true,
  syncTheme: true,
});

const diff = {
  theme: {
    token: {
      colorPrimary: "#CC3232",
      colorLink: "#CC3232",
    },
  },
} satisfies ConfigProviderProps;

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
      <ConfigProvider locale={zhCN} {...config}>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </StrictMode>
  );
};

export default Demo;
