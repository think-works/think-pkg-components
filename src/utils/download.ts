import { AxiosResponse } from "axios";

/**
 * 侦测 JSON 内容
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob/type
 * https://developer.mozilla.org/en-US/docs/Web/API/Blob/text
 * https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsText
 */
export const detectJsonBlob = async (data: Blob) => {
  if (data?.type === "application/json") {
    const blob = new Blob([data], { type: data.type });
    const text = blob.text ? await blob.text() : undefined;

    if (text) {
      try {
        const json = JSON.parse(text);
        return json;
      } catch {
        // ignore
      }
    }
  }
};

/**
 * 从 content-disposition 中侦测文件名
 * https://datatracker.ietf.org/doc/html/rfc6266
 * https://datatracker.ietf.org/doc/html/rfc5987
 */
export const detectFileName = (disposition: string) => {
  // 检查 filename*=<charset>'<language>'<percent-encoded-filename>
  const utf8Matched = disposition.match(/filename\*=(.*?)'(.*?)'([^;\n]*)/i);
  if (utf8Matched && utf8Matched[3]) {
    return decodeURIComponent(utf8Matched[3]);
  }

  // 检查 filename="example file.txt"
  const matched = disposition.match(/filename=(['"]?)([^;\n]*)\1/i);
  if (matched && matched[2]) {
    return decodeURIComponent(matched[2]);
  }
};

/**
 * 下载内存中文件
 */
export const downloadBlobFile = (
  blobParts: Blob,
  fileName: string,
  options?: {
    /** Blob MIME 类型 */
    type?: string;
  },
) => {
  const { type } = options || {};

  const blob = new Blob([blobParts], { type });
  const href = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(href);
};

/**
 * 根据接口响应下载内存中文件
 */
export const downloadBlobFileByResponse = async (
  response: AxiosResponse<Blob>,
  fileName?: string,
  options?: {
    /** 预检查 Blob 是否合法 */
    preCheckBlob?: (
      response: AxiosResponse<Blob>,
    ) => boolean | Promise<boolean>;
  },
) => {
  const dftPreCheckBlob = async (res: AxiosResponse<Blob>) => {
    const json = await detectJsonBlob(res.data);
    // 除非明确失败，否则认为合法。
    return !(json?.success === false);
  };

  const { data, headers } = response;
  const { preCheckBlob = dftPreCheckBlob } = options || {};

  // 预检查响应体
  const valid = preCheckBlob ? await preCheckBlob(response) : true;
  if (!valid) {
    return false;
  }

  // 侦测文件名称
  let detectName = fileName;
  if (!detectName) {
    // 自定义响应头 filename
    const headerName = headers?.filename;
    if (headerName) {
      detectName = decodeURIComponent(headerName);
    } else {
      // 标准响应头 content-disposition
      const disposition = headers?.["content-disposition"];
      if (disposition) {
        const dispositionName = detectFileName(disposition);
        if (dispositionName) {
          detectName = dispositionName;
        }
      }
    }
  }

  // 触发下载
  downloadBlobFile(data, detectName || "download");
  return true;
};
