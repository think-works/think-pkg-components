/// <reference types="vite/client" />

// 编译时常量
declare const __APP_NAME__: string;
declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;
declare const __BUILD_COMMIT__: string;

// 运行时变量
declare interface Window {}

// https://github.com/vitejs/vite/issues/2269#issuecomment-843688852
declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const url: string;
  export default url;
}
