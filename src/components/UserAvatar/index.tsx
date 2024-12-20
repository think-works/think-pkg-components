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
export const UserAvatar = forwardRef(function UserAvatarCom(
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

const UserAvatarExtend = UserAvatar as typeof UserAvatar & {
  getUserName: typeof getUserName;
  Group: typeof UserAvatarGroup;
};

UserAvatarExtend.getUserName = getUserName;
UserAvatarExtend.Group = UserAvatarGroup;

export default UserAvatarExtend;
