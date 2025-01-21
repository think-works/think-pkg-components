import { BaseAvatar, UserAvatar } from "@/components";

const AvatarDemo = () => {
  return (
    <div style={{ marginLeft: "100px" }}>
      <BaseAvatar size="large" name="张三" />
      <br />
      <BaseAvatar size="default" name="张三" />
      <br />
      <BaseAvatar size="small" name="张三" />
      <br />
      <BaseAvatar name="李四" />
      <br />
      <br />
      <UserAvatar hideName userModel={{ loginName: "zhangsan" }} />
      <br />
      <UserAvatar hideName userModel={{ nickName: "张三" }} />
      <br />
      <UserAvatar
        hideName
        showTooltip={{ placement: "right" }}
        userModel={{ nickName: "李四", loginName: "lisi" }}
      />
      <br />
      <br />
      <UserAvatar.Group
        userModels={[
          { nickName: "张三" },
          { nickName: "李四", loginName: "lisi" },
        ]}
      />
      <br />
      <UserAvatar.Group
        tooltipProps={{ placement: "right" }}
        userModels={[
          { nickName: "张三" },
          { nickName: "李四", loginName: "lisi" },
          { nickName: "王五" },
        ]}
      />
      <br />
      <UserAvatar.Group
        maxCount={3}
        userModels={[
          { nickName: "张三" },
          { nickName: "李四", loginName: "lisi" },
          { nickName: "王五" },
          { nickName: "马六", loginName: "maliu" },
        ]}
      />
      <br />
      <br />
      <UserAvatar userModel={{ nickName: "张三" }} />
      <UserAvatar userModel={{ nickName: "李四", loginName: "lisi" }} />
      <UserAvatar showTooltip userModel={{ nickName: "张三" }} />
      <UserAvatar
        showTooltip={{ placement: "right" }}
        userModel={{ nickName: "李四", loginName: "lisi" }}
      />
      <br />
      <div style={{ width: "100px" }}>
        <UserAvatar
          showTooltip
          userModel={{ nickName: "非常非常非常非常长的名字" }}
        />
      </div>
    </div>
  );
};

export default AvatarDemo;
