import { keyPrefix } from "@/utils/config";
import logger from "@/utils/logger";
import * as tools from "@/utils/tools";

/**
 * 查询本地缓存
 */
export const queryLocal = <T = any>(
  localKey: string,
  session?: boolean,
): T | void => {
  try {
    const key = `${keyPrefix}_${localKey}`;
    const config = tools.queryStorage(key, { session, jsonVal: true });
    return config;
  } catch (e: any) {
    logger.error(e);
  }
};

/**
 * 更新本地缓存
 * @param localKey
 * @param val
 * @param session  是否 session 缓存
 */
export const updateLocal = <T = any>(
  localKey: string,
  val: T,
  session?: boolean,
) => {
  try {
    const key = `${keyPrefix}_${localKey}`;
    tools.updateStorage(key, val, { session, jsonVal: true });
  } catch (e: any) {
    logger.error(e);
  }
};

/**
 * 删除本地缓存
 */
export const deleteLocal = (localKey: string, session?: boolean) => {
  try {
    const key = `${keyPrefix}_${localKey}`;
    tools.deleteStorage(key, { session });
  } catch (e: any) {
    logger.error(e);
  }
};
