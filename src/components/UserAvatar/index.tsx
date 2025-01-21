import { Tooltip, TooltipProps } from "antd";
import cls, { Argument } from "classnames";
import { ForwardedRef, forwardRef } from "react";
import { isType } from "@/utils/tools";
import BaseAvatar, { BaseAvatarProps } from "../BaseAvatar";
import UserAvatarGroup, { getUserName, UserModel } from "./Group";
import stl from "./index.module.less";

const isBoolean = (val: any) => isType<boolean>(val, "Boolean");

export type UserAvatarProps = BaseAvatarProps & {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    avatar?: Argument;
    name?: Argument;
  };
  styles?: {
    avatar?: React.CSSProperties;
    name?: React.CSSProperties;
  };
  hideName?: boolean;
  showTooltip?: boolean | TooltipProps;
  userModel?: UserModel;
};

/**
 * 用户头像
 */
const UserAvatarBase = forwardRef(function UserAvatarCom(
  props: UserAvatarProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    style,
    classNames,
    styles,
    userModel,
    hideName,
    showTooltip,
    ...rest
  } = props;

  if (!userModel) {
    return null;
  }

  const tooltipProps = isBoolean(showTooltip) ? undefined : showTooltip;
  const { nickName, loginName } = userModel;
  const userName = getUserName(userModel);

  const avatarCom = (
    <BaseAvatar
      className={cls(stl.avatar, classNames?.avatar)}
      style={styles?.avatar}
      name={nickName || loginName}
      {...rest}
    />
  );

  if (hideName) {
    return (
      <Tooltip title={userName} {...(tooltipProps || {})}>
        {avatarCom}
      </Tooltip>
    );
  }

  return (
    <div ref={ref} className={cls(stl.userAvatar, className)} style={style}>
      {showTooltip ? (
        <Tooltip title={userName} {...(tooltipProps || {})}>
          {avatarCom}
        </Tooltip>
      ) : (
        avatarCom
      )}
      <span
        className={cls(stl.name, classNames?.name)}
        style={styles?.name}
        title={userName}
      >
        {nickName || loginName}
      </span>
    </div>
  );
});

export const UserAvatar = UserAvatarBase as typeof UserAvatarBase & {
  getUserName: typeof getUserName;
  Group: typeof UserAvatarGroup;
};

UserAvatar.getUserName = getUserName;
UserAvatar.Group = UserAvatarGroup;

export default UserAvatar;
