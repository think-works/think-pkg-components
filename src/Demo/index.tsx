import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import { StrictMode, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { themes } from "@/components";
import { router } from "./router";
import "dayjs/locale/zh-cn";
import "./index.less";

dayjs.locale("zh-CN");

const Demo = () => {
  useEffect(() => {
    return themes.listenBrowserTheme((value) => {
      themes.updateThemeAttribute(value);
    });
  });

  return (
    <StrictMode>
      <ConfigProvider {...themes.defaultConfigProviderProps} locale={zhCN}>
        <AntdApp>
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </StrictMode>
  );
};

export default Demo;
