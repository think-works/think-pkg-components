import cProcess from "child_process";
import path from "path";
import process from "process";
// import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath } from "url";
import { defineConfig, loadEnv } from "vite";
import checker from "vite-plugin-checker";
import mockDevServer from "vite-plugin-mock-dev-server";
import svgr from "@svgr/rollup";
import react from "@vitejs/plugin-react";
import { name, peerDependencies, version } from "./package.json";
import proxy from "./vite.proxy.js";

const libraryName = name.slice(name.indexOf("/") + 1);
const srcPath = fileURLToPath(new URL("src", import.meta.url));
const external = Object.keys(peerDependencies || {}).concat([
  "react/jsx-runtime",
]);

export default defineConfig(({ mode }) => {
  const date = new Date().toISOString();
  const commit = cProcess
    .execSync("git rev-parse HEAD || echo UNKNOWN")
    .toString()
    .trim();

  process.env.VITE_APP_NAME = name;
  process.env.VITE_APP_VERSION = version;
  process.env.VITE_BUILD_DATE = date;
  process.env.VITE_BUILD_COMMIT = commit;

  const env = loadEnv(mode, process.cwd(), "");

  const proxyTarget = env.PROXY_TARGET;
  const mockEnable = env.MOCK_ENABLE === "true";
  const buildSourcemap = env.BUILD_SOURCEMAP === "true";
  const buildIgnoreMinify = env.BUILD_IGNORE_MINIFY === "true";

  let apiBase = env.VITE_API_BASE || "/";
  apiBase = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;

  const proxyCfg = proxy({
    apiBase,
    proxyTarget,
  });

  return {
    clearScreen: false,
    resolve: {
      alias: {
        "@/": path.join(srcPath, "/"),
      },
    },
    server: {
      host: "0.0.0.0",
      proxy: proxyTarget ? proxyCfg : undefined,
    },
    build: {
      minify: !buildIgnoreMinify,
      sourcemap: buildSourcemap,
      lib: {
        formats: ["es", "cjs"],
        entry: path.join(srcPath, libraryName),
        /** 为配合 tsc-alias 生成类型文件，使用入口文件名作为库导出名 */
        // fileName: libraryName,
        cssFileName: libraryName,
      },
      rollupOptions: {
        external,
        output: {
          sourcemapExcludeSources: true,
          banner: `/*!\n * APP_NAME: ${name}\n * APP_VERSION: ${version}\n * BUILD_DATE: ${date}\n * BUILD_COMMIT: ${commit}\n */\n`,
        },
      },
    },
    css: {
      modules: {
        /**
         * 自定义 classname 名称
         * https://github.com/madyankin/postcss-modules/blob/master/src/scoping.js#L36
         */
        generateScopedName: `${libraryName}_[folder]_[local]`,
      },
    },
    plugins: [
      react(),
      mockEnable
        ? mockDevServer({
            prefix: proxyTarget ? [] : Object.keys(proxyCfg),
          })
        : undefined,
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: "eslint './src/**/*.{ts,tsx,js,jsx}'",
        },
        overlay: {
          initialIsOpen: false,
        },
      }),
      svgr({
        /**
         * 指定为命名导入方式以避免不确定性
         * https://react-svgr.com/docs/rollup/
         */
        exportType: "named",
        ref: true,
        icon: true,
        svgProps: {
          fill: "currentColor",
          focusable: false,
          "aria-hidden": true,
        },
      }),
      // visualizer(),
    ],
  };
});
