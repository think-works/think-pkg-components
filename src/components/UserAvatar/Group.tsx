import { Avatar, GetProps, Tooltip } from "antd";
import { truthy } from "@/utils/types";
import BaseAvatar from "../BaseAvatar";
import stl from "./index.module.less";

export type UserModel = {
  loginName?: string;
  nickName?: string;
};

export const getUserName = ({ nickName, loginName }: UserModel) =>
  loginName && nickName ? `${nickName}(${loginName})` : loginName || nickName;

export type UserAvatarGroupProps = GetProps<typeof Avatar.Group> & {
  maxCount?: number;
  userModels?: (UserModel | undefined)[];
};

/**
 * 用户头像组
 */
const UserAvatarGroup = (props: UserAvatarGroupProps) => {
  const { maxCount = 2, userModels, ...rest } = props;
  const list = userModels?.filter(truthy);

  if (!list?.length) {
    return null;
  }

  return (
    <Avatar.Group
      className={stl.userAvatarGroup}
      size="small"
      max={{ count: maxCount }}
      {...rest}
    >
      {list?.map((item) => {
        const { nickName } = item;
        const userName = getUserName(item);
        return (
          <Tooltip key={userName} title={userName}>
            <span>
              <BaseAvatar className={stl.avatar} name={nickName} />
            </span>
          </Tooltip>
        );
      })}
    </Avatar.Group>
  );
};

export default UserAvatarGroup;
