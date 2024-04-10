/* eslint-disable no-console */
import { appName, isProd } from "@/utils/config";

export const debug = (...rest: any[]) => {
  if (!isProd) {
    console.debug(`[${appName}]`, ...rest);
  }
};

export const info = (...rest: any[]) => {
  console.info(`[${appName}]`, ...rest);
};

export const warn = (...rest: any[]) => {
  console.warn(`[${appName}]`, ...rest);
};

export const error = (...rest: any[]) => {
  console.error(`[${appName}]`, ...rest);
};

const logger = {
  debug,
  info,
  warn,
  error,
};

export default logger;
