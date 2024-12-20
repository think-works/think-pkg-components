import { Space, Tooltip } from "antd";
import { ForwardedRef, forwardRef } from "react";
import BaseAvatar, { BaseAvatarProps } from "../BaseAvatar";
import UserAvatarGroup, { getUserName, UserModel } from "./Group";
import stl from "./index.module.less";

export type UserAvatarProps = Omit<BaseAvatarProps, "userInfo"> & {
  userModel?: UserModel;
  hideName?: boolean;
};

/**
 * 用户头像
 */
const UserAvatarBase = forwardRef(function UserAvatarCom(
  props: UserAvatarProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { userModel, hideName, ...rest } = props;

  if (!userModel) {
    return null;
  }

  const { nickName } = userModel;
  const userName = getUserName(userModel);
  const avatar = (
    <BaseAvatar className={stl.avatar} name={nickName} {...rest} />
  );

  if (hideName) {
    return (
      <Tooltip title={userName}>
        <span>{avatar}</span>
      </Tooltip>
    );
  }

  return (
    <Space ref={ref} className={stl.userAvatar}>
      {avatar}
      <span className={stl.name} title={userName}>
        {userName}
      </span>
    </Space>
  );
});

export const UserAvatar = UserAvatarBase as typeof UserAvatarBase & {
  getUserName: typeof getUserName;
  Group: typeof UserAvatarGroup;
};

UserAvatar.getUserName = getUserName;
UserAvatar.Group = UserAvatarGroup;

export default UserAvatar;
