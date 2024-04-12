import { Avatar, AvatarProps } from "antd";
import { useMemo } from "react";
import { UserOutlined } from "@ant-design/icons";
import { hashColor } from "@/common/colors";

type UserInfo = {
  name?: string | React.ReactNode;
  avatar?: string | React.ReactNode;
};

export type BaseAvatarProps = AvatarProps & {
  userInfo?: UserInfo;
  nameSlice?: (name: string) => string;
};

/**
 * 基础头像
 */
export const BaseAvatar = (props: BaseAvatarProps) => {
  const { style, userInfo, nameSlice, ...rest } = props;
  const { name, avatar } = userInfo || {};

  const { src, color, child } = useMemo(() => {
    let src;
    let color;
    let child;

    if (avatar) {
      if (typeof avatar === "string") {
        src = avatar;
      } else {
        child = avatar;
      }
    } else if (name) {
      if (typeof name === "string") {
        color = hashColor(name);
        if (typeof nameSlice === "function") {
          child = nameSlice(name);
        } else {
          // 纯英文字符串
          if (/^[\x20-\x7F]+$/.test(name)) {
            // 按照空格分割
            const parts = name.trim().split(/\s+/);
            // 单词首字母大写
            const text = parts.map((part) => part[0].toUpperCase()).join("");
            // 取前两个字符
            child = text.slice(0, 2);
          } else {
            // 移除前后英文字符
            const text = name
              .trim()
              .replace(/^[\x20-\x7F]+/, "")
              .replace(/[\x20-\x7F]+$/, "");
            // 取后两个字符
            child = text.slice(-2);
          }
        }
      } else {
        child = name;
      }
    } else {
      child = <UserOutlined />;
    }

    return { src, color, child };
  }, [avatar, name, nameSlice]);

  return (
    <Avatar
      size="small"
      src={src}
      style={{
        userSelect: "none",
        color: color?.color,
        backgroundColor: color?.bgColor,
        ...(style || {}),
      }}
      {...rest}
    >
      {child}
    </Avatar>
  );
};

export default BaseAvatar;
