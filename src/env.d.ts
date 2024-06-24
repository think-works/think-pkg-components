/// <reference types="vite/client" />

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
