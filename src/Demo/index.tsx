import { App as AntdApp, ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import dayjs from "dayjs";
import { themes } from "@/components";
import "dayjs/locale/zh-cn";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.less";

dayjs.locale("zh-CN");

const Demo = () => {
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
