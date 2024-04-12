import { Upload, UploadProps } from "antd";
import axios, { AxiosInstance } from "axios";
import cls, { Argument } from "classnames";
import { isNumber } from "lodash-es";
import React from "react";
import logger from "@/utils/logger";
import stl from "./index.module.less";

export type UploaderProps = UploadProps & {
  className?: Argument;
  children?: React.ReactNode;
  maxSize?: number;
  onSizeOver?: (file: any) => void;
  onSuccess?: (info: any) => void;
  onError?: (info: any) => void;
  axiosInstance?: AxiosInstance;
  axiosConfig?: Record<string, any>;
};

/**
 * 异步上传
 */
export class Uploader extends React.Component<UploaderProps, any> {
  static Dragger: any;

  protected getUploadProps = () => {
    const {
      className,
      children,
      maxSize,
      onSizeOver,
      onSuccess,
      onError,
      axiosInstance = axios,
      axiosConfig = {},
      ...rest
    } = this.props;

    return {
      name: "file",
      maxCount: 1,
      showUploadList: {
        showPreviewIcon: false,
        showRemoveIcon: false,
        showDownloadIcon: false,
      },
      beforeUpload: (file: any) => {
        const { size } = file;
        if (isNumber(maxSize) && size > maxSize) {
          onSizeOver && onSizeOver(file);
          return Upload.LIST_IGNORE;
        }
      },
      onChange: (info: any) => {
        const { file } = info;
        const { status } = file;

        if (status === "done") {
          onSuccess && onSuccess(info);
          return;
        }

        if (status === "error") {
          onError && onError(info);
          return;
        }
      },
      customRequest: ({
        method = "post",
        action,
        data,
        headers,
        withCredentials,
        file,
        filename,
        onProgress,
        onSuccess,
        onError,
      }: any) => {
        const controller = new AbortController();

        const formData = new FormData();
        if (data) {
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
        }
        formData.append(filename, file);

        (axiosInstance as any)
          [method](action, formData, {
            headers,
            withCredentials,
            signal: controller.signal,
            onUploadProgress: ({ total, loaded }: any) => {
              onProgress(
                { percent: Math.round((loaded / total) * 100).toFixed(2) },
                file,
              );
            },
            ...(axiosConfig || {}),
          })
          .then((body: any) => {
            onSuccess(body, file);
          })
          .catch((error: any) => {
            logger.error(error);
            onError(error, error?.response?.data, file);
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

  render() {
    const { className, children } = this.props;
    const uploadProps = this.getUploadProps();

    return (
      <Upload className={cls(stl.uploader, className)} {...uploadProps}>
        {children}
      </Upload>
    );
  }
}

/**
 * 拖拽异步上传
 */
class Dragger extends Uploader {
  render() {
    const { className, children } = this.props;
    const uploadProps = this.getUploadProps();

    return (
      <Upload.Dragger className={cls(stl.dragger, className)} {...uploadProps}>
        {children}
      </Upload.Dragger>
    );
  }
}

Uploader.Dragger = Dragger;

export default Uploader;
