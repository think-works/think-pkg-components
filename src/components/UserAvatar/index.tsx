import { Space, Tooltip } from "antd";
import BaseAvatar, { BaseAvatarProps } from "../BaseAvatar";
import UserAvatarGroup from "./Group";

export type UserModel = {
  loginName?: string;
  nickName?: string;
};

export const getUserName = ({ nickName, loginName }: UserModel) =>
  nickName ? `${nickName}(${loginName})` : loginName;

export type UserAvatarProps = Omit<BaseAvatarProps, "userInfo"> & {
  userModel?: UserModel;
  hideName?: boolean;
};

const UserAvatar = (props: UserAvatarProps) => {
  const { userModel, hideName, ...rest } = props;

  if (!userModel) {
    return null;
  }

  const { nickName } = userModel;
  const userName = getUserName(userModel);
  const avatar = <BaseAvatar userInfo={{ name: nickName }} {...rest} />;

  if (hideName) {
    return <Tooltip title={userName}>{avatar}</Tooltip>;
  }

  return (
    <Space>
      {avatar}
      <span>{userName}</span>
    </Space>
  );
};

UserAvatar.getUserName = getUserName;
UserAvatar.Group = UserAvatarGroup;

export default UserAvatar;
