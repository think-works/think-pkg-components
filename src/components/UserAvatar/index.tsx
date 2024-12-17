import { Space, Tooltip } from "antd";
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
export const UserAvatar = (props: UserAvatarProps) => {
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
    <Space className={stl.userAvatar}>
      {avatar}
      <span className={stl.name} title={userName}>
        {userName}
      </span>
    </Space>
  );
};

UserAvatar.getUserName = getUserName;
UserAvatar.Group = UserAvatarGroup;

export default UserAvatar;
