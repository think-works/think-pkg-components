/**
 * @typedef {import('vite').ProxyOptions} ProxyOptions
 */

/**
 * 获取通用选项
 * @param {ProxyOptions} options
 * @returns {ProxyOptions}
 */
const getCommonOptions = (options) => {
  const { target, headers, ...rest } = options || {};

  return {
    target,
    changeOrigin: true, // host 请求头
    cookieDomainRewrite: "", // cookie 所属域
    headers: {
      referer: target, // referer 检查
      ...(headers || {}),

      /** Grafana 需要配置 Origin 和 Connection */
      // Origin: target, // https://github.com/http-party/node-http-proxy/pull/1130
      // Connection: "keep-alive", // https://stackoverflow.com/a/53499411
    },
    ...rest,
  };
};

/**
 * 获取代理规则
 * @param {string[]} proxyPaths
 * @param {ProxyOptions} options
 * @returns {Object.<string, ProxyOptions>}
 */
const getProxyRules = (proxyPaths, options) => {
  return (proxyPaths || []).reduce((rules, path) => {
    rules[path] = { ...(options || {}) };
    return rules;
  }, {});
};

/**
 * 获取代理配置
 * @param {Object} config
 * @param {Object} config.env
 * @returns {Object.<string, ProxyOptions>}
 */
export default (config) => {
  const { env } = config || {};

  const platformProxyTarget = env.PLATFORM_PROXY_TARGET;
  const productProxyTarget = env.PRODUCT_PROXY_TARGET || platformProxyTarget;

  let platformBase = env.VITE_PLATFORM_BASE || "/";
  platformBase = platformBase.endsWith("/") ? platformBase : `${platformBase}/`;

  let apiBase = env.VITE_API_BASE || "/";
  apiBase = apiBase.endsWith("/") ? apiBase : `${apiBase}/`;

  if (!productProxyTarget) {
    return {};
  }

  return {
    ...getProxyRules(
      [
        `${platformBase}login`,
        `${platformBase}meta`,
        `${platformBase}self-monitor`,
        `${platformBase}quality/api`,
      ],
      getCommonOptions({ target: platformProxyTarget }),
    ),
    [`${apiBase}api`]: getCommonOptions({
      target: productProxyTarget,
    }),
  };
};
