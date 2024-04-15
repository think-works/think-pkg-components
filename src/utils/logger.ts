/* eslint-disable no-console */
import { appName } from "@/utils/config";

export const createLogger = (scope: string) => {
  const debug = (...rest: any[]) => {
    console.debug(`[${scope}]`, ...rest);
  };

  const info = (...rest: any[]) => {
    console.info(`[${scope}]`, ...rest);
  };

  const log = (...rest: any[]) => {
    console.log(`[${scope}]`, ...rest);
  };

  const warn = (...rest: any[]) => {
    console.warn(`[${scope}]`, ...rest);
  };

  const error = (...rest: any[]) => {
    console.error(`[${scope}]`, ...rest);
  };

  return {
    debug,
    info,
    log,
    warn,
    error,
  };
};

const logger = createLogger(appName);

export default logger;
