import { Avatar, GetProps, Tooltip, TooltipProps } from "antd";
import cls, { Argument } from "classnames";
import { truthy } from "@/utils/types";
import BaseAvatar from "../BaseAvatar";
import stl from "./index.module.less";

export type UserModel = {
  loginName?: string;
  nickName?: string;
};

export const getUserName = ({ nickName, loginName }: UserModel) =>
  nickName && loginName ? `${nickName}(${loginName})` : nickName || loginName;

export type UserAvatarGroupProps = GetProps<typeof Avatar.Group> & {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    avatar?: Argument;
  };
  styles?: {
    avatar?: React.CSSProperties;
  };
  maxCount?: number;
  tooltipProps?: TooltipProps;
  userModels?: (UserModel | undefined)[];
};

/**
 * 用户头像组
 */
const UserAvatarGroup = (props: UserAvatarGroupProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    maxCount = 2,
    tooltipProps,
    userModels,
    ...rest
  } = props;
  const list = userModels?.filter(truthy);

  if (!list?.length) {
    return null;
  }

  return (
    <Avatar.Group
      className={cls(stl.userAvatarGroup, className)}
      style={style}
      size="small"
      max={{ count: maxCount }}
      {...rest}
    >
      {list?.map((item) => {
        const { nickName, loginName } = item;
        const userName = getUserName(item);
        return (
          <Tooltip key={userName} title={userName} {...(tooltipProps || {})}>
            <BaseAvatar
              className={cls(stl.avatar, classNames?.avatar)}
              style={styles?.avatar}
              name={nickName || loginName}
            />
          </Tooltip>
        );
      })}
    </Avatar.Group>
  );
};

export default UserAvatarGroup;
