import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import { StrictMode, useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { themes } from "@/components";
import { router } from "./router";
import "dayjs/locale/zh-cn";
import "./index.less";

dayjs.locale("zh-CN");

const dftScheme = themes.detectThemeScheme({ syncTheme: true });
const dftConfig = themes.getConfigProviderProps(dftScheme);

const Demo = () => {
  const [config, setConfig] = useState(dftConfig);

  useEffect(() => {
    return themes.listenBrowserTheme((value) => {
      const cfg = themes.getConfigProviderProps(value);
      setConfig(cfg);

      themes.updateThemeAttribute(value);
      themes.updateThemeStorage(value);
    });
  }, []);

  return (
    <StrictMode>
      <ConfigProvider {...config} locale={zhCN}>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </StrictMode>
  );
};

export default Demo;
