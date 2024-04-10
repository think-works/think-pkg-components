import { Avatar, GetProps, Tooltip } from "antd";
import { truthy } from "@/utils/types";
import BaseAvatar from "../BaseAvatar";
import { getUserName, UserModel } from "./index";
import stl from "./index.module.less";

export type UserAvatarGroupProps = GetProps<typeof Avatar.Group> & {
  userModels?: (UserModel | undefined)[];
};

const UserAvatarGroup = (props: UserAvatarGroupProps) => {
  const { userModels, ...rest } = props;
  const list = userModels?.filter(truthy);

  if (!list?.length) {
    return null;
  }

  return (
    <Avatar.Group
      className={stl.avatarGroup}
      size="small"
      maxCount={2}
      {...rest}
    >
      {list?.map((item) => {
        const { nickName } = item;
        const userName = getUserName(item);
        return (
          <Tooltip key={userName} title={userName}>
            <BaseAvatar className={stl.avatar} userInfo={{ name: nickName }} />
          </Tooltip>
        );
      })}
    </Avatar.Group>
  );
};

export default UserAvatarGroup;
