import { DraggerProps, Upload, UploadProps } from "antd";
import axios, { AxiosInstance } from "axios";
import cls from "classnames";
import logger from "@/utils/logger";
import { isType } from "@/utils/tools";
import stl from "./index.module.less";

const isNumber = (val: any) => isType<number>(val, "Number");
const isFunction = (val: any) =>
  isType<(...params: any[]) => any>(val, "Function");

type BeforeUploadParams = Parameters<NonNullable<UploadProps["beforeUpload"]>>;
type OnChangeParams = Parameters<NonNullable<UploadProps["onChange"]>>;
type CustomRequestParams = Parameters<
  NonNullable<UploadProps["customRequest"]>
>;

export type UploaderProps<T = any> = UploadProps<T> & {
  /** 最大文件大小 */
  maxSize?: number;
  /** 超出文件大小限制 */
  onSizeOver?: (
    file: BeforeUploadParams[0],
    fileList: BeforeUploadParams[1],
  ) => void;
  /** 超出文件类型限制 */
  onAcceptOver?: (
    file: BeforeUploadParams[0],
    fileList: BeforeUploadParams[1],
  ) => void;
  /** 上传成功 */
  onSuccess?: (info: OnChangeParams[0]) => void;
  /** 上传失败 */
  onError?: (info: OnChangeParams[0]) => void;
  /** axios 实例 */
  axiosInstance?: AxiosInstance;
  /** axios 配置 */
  axiosConfig?: Record<string, any>;
};

const getUploadProps = (props: UploaderProps): UploadProps => {
  const {
    maxSize,
    onSizeOver,
    onAcceptOver,
    onSuccess,
    onError,
    axiosInstance = axios,
    axiosConfig = {},

    name = "file",
    accept,
    beforeUpload,
    onChange,
    customRequest,
    ...rest
  } = props;
  const { onUploadProgress, ...axiosRest } = axiosConfig || {};

  return {
    name,
    accept,
    maxCount: 1,
    showUploadList: {
      showPreviewIcon: false,
      showRemoveIcon: false,
      showDownloadIcon: false,
    },
    beforeUpload: (file, fileList) => {
      if (isFunction(beforeUpload)) {
        const ret = beforeUpload(file, fileList);
        if (ret || ret === false) {
          return ret;
        }
      }

      // 检查文件大小
      if (isNumber(maxSize) && file.size > maxSize) {
        if (isFunction(onSizeOver)) {
          onSizeOver(file, fileList);
        }
        return Upload.LIST_IGNORE;
      }

      // 检查文件类型
      if (accept) {
        let exist = false;

        // 以 , 分隔的类型，如 .png, image/png, image/* 等。
        const allowType = accept
          .split(",")
          .map((x) => x.trim().toLocaleLowerCase())
          .filter(Boolean);
        // 以 . 开头的后缀名，如 .png 等。
        const allowSuffix = allowType.filter((x) => x.startsWith("."));
        // 有 / 的 MIME 类型，如 image/png, image/* 等。并替换结尾 /* 为 / 以便使用。
        const allowMime = allowType
          .filter((x) => x.includes("/"))
          .map((x) => x.replace(/\/\*$/, "/"));

        // 检查后缀名
        const suffix = file.name.split(".").pop()?.trim().toLocaleLowerCase();
        if (!exist && suffix && allowSuffix.some((x) => x === `.${suffix}`)) {
          exist = true;
        }

        // 检查 MIME (暂不考虑前缀相同的类型，如 application/ATF 和 application/ATFX )
        const mime = file.type.trim().toLocaleLowerCase();
        if (!exist && mime && allowMime.some((x) => mime.startsWith(x))) {
          exist = true;
        }

        if (!exist) {
          if (isFunction(onAcceptOver)) {
            onAcceptOver(file, fileList);
          }
          return Upload.LIST_IGNORE;
        }
      }
    },
    onChange: (info) => {
      if (isFunction(onChange)) {
        onChange(info);
      }

      const { file } = info;
      const { status } = file;

      if (status === "done") {
        if (isFunction(onSuccess)) {
          onSuccess(info);
        }
        return;
      }

      if (status === "error") {
        if (isFunction(onError)) {
          onError(info);
        }
        return;
      }
    },
    customRequest: (options, ...rest) => {
      if (isFunction(customRequest)) {
        return customRequest(options, ...rest);
      }

      const {
        method = "post",
        action,
        data,
        headers,
        withCredentials,
        file,
        filename = name,
        onProgress,
        onSuccess,
        onError,
      } = options;
      const lowerCaseMethod = method.toLowerCase() as Lowercase<
        CustomRequestParams[0]["method"]
      >;

      const controller = new AbortController();

      const formData = new FormData();
      formData.append(filename, file);
      if (data) {
        Object.keys(data).forEach((key) => {
          const val = data[key];
          formData.append(key, val as any);
        });
      }

      axiosInstance[lowerCaseMethod](action, formData, {
        headers,
        withCredentials,
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          if (isFunction(onUploadProgress)) {
            onUploadProgress(progressEvent);
          }

          const { total, loaded } = progressEvent;
          let percent = 0;
          if (total && loaded) {
            percent = Math.round((loaded / total) * 10000) / 100;
          }

          onProgress?.(
            {
              percent,
              ...progressEvent,
            },
            file,
          );
        },
        ...axiosRest,
      })
        .then((body: any) => {
          onSuccess?.(body, file);
        })
        .catch((error: any) => {
          logger.error(error);
          onError?.(error, error?.response?.data);
        });

      return {
        abort() {
          controller.abort();
        },
      };
    },
    ...rest,
  };
};

/**
 * 上传
 */
const UploaderBase = (props: UploaderProps) => {
  const { className, children, ...rest } = props;
  const uploadProps = getUploadProps(rest);

  return (
    <Upload className={cls(stl.uploader, className)} {...uploadProps}>
      {children}
    </Upload>
  );
};

/**
 * 拖拽上传
 */
const Dragger = (props: DraggerProps) => {
  const { className, children, ...rest } = props;
  const uploadProps = getUploadProps(rest);

  return (
    <Upload.Dragger className={cls(stl.dragger, className)} {...uploadProps}>
      {children}
    </Upload.Dragger>
  );
};

export const Uploader = UploaderBase as typeof UploaderBase & {
  Dragger: typeof Dragger;
};

Uploader.Dragger = Dragger;

export default Uploader;
