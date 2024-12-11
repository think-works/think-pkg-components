/**
 * 是否支持 Web Storage
 */
export const supportStorage = () => {
  if (window.sessionStorage) {
    try {
      const item = "sessionStorage-test";
      window.sessionStorage.setItem(item, item);
      window.sessionStorage.removeItem(item);
      return true;
    } catch {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * 待对比版本是否大于（等于）基础版本
 */
export const gtVer = (baseVer: number[], compareVer: number[], eq = true) => {
  if (baseVer && baseVer.length > 0 && compareVer && compareVer.length > 0) {
    const maxLength =
      baseVer.length > compareVer.length ? baseVer.length : compareVer.length;

    for (let i = 0; i < maxLength; i++) {
      const base = baseVer[i];
      const compare = compareVer[i];

      if (compare > base) {
        return true;
      } else if (compare < base) {
        return false;
      } else {
        // 检测最后一位是否相等
        if (i + 1 === maxLength) {
          return eq;
        }
      }
    }
  }

  return false;
};

/**
 * 是否为 Windows
 */
export const isWindows = () => {
  return !!window.navigator.userAgent.match(/Windows/i);
};

/**
 * 是否为 Mac
 */
export const isMac = () => {
  return !!window.navigator.userAgent.match(/Macintosh/i);
};

/**
 * 是否为 Android
 */
export const isAndroid = () => {
  return !!window.navigator.userAgent.match(/Android/i);
};

/**
 * 是否为 IOS
 */
export const isIOS = () => {
  return !!window.navigator.userAgent.match(/(iPhone)|(iPad)|(iPod)/i);
};

/**
 * 是否为 Android WebView
 */
export const isAndroidWebView = () => {
  // https://developer.chrome.com/multidevice/user-agent
  const userAgent = window.navigator.userAgent;
  const android = userAgent.match(/Android/i);
  const wv = userAgent.match(/wv/i);

  return android && wv;
};

/**
 * 是否为 IOS WebView
 */
export const isIOSWebView = () => {
  // https://stackoverflow.com/questions/4460205/detect-ipad-iphone-webview-via-javascript
  // @ts-ignore
  const standalone = window.navigator.standalone;
  const userAgent = window.navigator.userAgent;
  const ios = userAgent.match(/(iPhone)|(iPad)|(iPod)/i);
  const safari = userAgent.match(/Safari/i);

  return ios && !safari && !standalone;
};

/**
 * Windows 版本
 */
export const windowsVer = () => {
  const match = window.navigator.userAgent.match(
    /Windows NT (\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};

/**
 * Mac 版本
 */
export const macVer = () => {
  const match = window.navigator.userAgent.match(
    /Mac OS X (\d+)(_(\d+))?(_(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};

/**
 * Android 版本
 */
export const androidVer = () => {
  const match = window.navigator.userAgent.match(
    /Android (\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};

/**
 * IOS 版本
 */
export const iosVer = () => {
  const match = window.navigator.userAgent.match(
    /OS (\d+)(_(\d+))?(_(\d+))? like Mac OS X/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};

/**
 * Chrome 版本
 */
export const chromeVer = () => {
  const match = window.navigator.userAgent.match(
    /Chrome\/(\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};

/**
 * Firefox 版本
 */
export const firefoxVer = () => {
  const match = window.navigator.userAgent.match(
    /Firefox\/(\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};

/**
 * IE 版本
 */
export const ieVer = () => {
  const match = window.navigator.userAgent.match(
    /MSIE (\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  const match2 = window.navigator.userAgent.match(
    /rv:(\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match2) {
    return [
      parseInt(match2[1] ? match2[1] : "0"),
      parseInt(match2[3] ? match2[3] : "0"),
      parseInt(match2[5] ? match2[5] : "0"),
    ];
  }

  return null;
};

/**
 * Edge 版本
 */
export const edgeVer = () => {
  const match = window.navigator.userAgent.match(
    /Edge\/(\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};

/**
 * Safari 技术版本
 */
export const safariTechVer = () => {
  const match = window.navigator.userAgent.match(
    /Safari\/(\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};

/**
 * Safari 用户版本
 */
export const safariUserVer = () => {
  const match = window.navigator.userAgent.match(
    /Version\/(\d+)(\.(\d+))?(\.(\d+))?/i,
  );
  if (match) {
    return [
      parseInt(match[1] ? match[1] : "0"),
      parseInt(match[3] ? match[3] : "0"),
      parseInt(match[5] ? match[5] : "0"),
    ];
  }

  return null;
};
