import { Table } from "antd";
import { useEffect, useState } from "react";
import { HomeFilled } from "@ant-design/icons";
import {
  EditableTable,
  LayoutDetail,
  LayoutSiderItemMode,
  LayoutWrapper,
  layoutWrapperUtils,
} from "@/components";

const { EditableHeader } = EditableTable;
const { registerCustomMenus } = layoutWrapperUtils;

const DragContainerDemo = () => {
  const [value, setValue] = useState("key");

  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    return registerCustomMenus?.([
      {
        key: "page-layout2",
        label: "工作台",
        icon: <HomeFilled />,
      },
      {
        key: "page-layout3",
        label: "我的项目",
        icon: <HomeFilled />,
      },
      {
        key: "page-layout5",
        label: "项目管理",
        icon: <HomeFilled />,
      },
      {
        key: "grp",
        label: "系统管理",
        icon: <HomeFilled />,
        children: [
          {
            key: "page-layout471",
            label: "用户管理",
          },
          {
            key: "page-layout47",
            label: "角色管理",
          },
          {
            key: "page-layout472",
            label: "用户管理",
          },
          {
            key: "page-layout473",
            label: "角色管理",
          },
          {
            key: "page-layout474",
            label: "用户管理",
          },
          {
            key: "page-layout475",
            label: "角色管理",
          },
          {
            key: "page-layout46",
            label: "性能测试",
            children: [
              {
                key: "page-layout",
                label: "压力机管理",
              },
            ],
          },
          {
            key: "page-layout41",
            label: "测试管理",
            children: [
              {
                key: "page-layout55",
                label: "拓展字段",
              },
            ],
          },
        ],
      },
      {
        key: "grp2",
        label: "个人设置",
        icon: <HomeFilled />,
        children: [
          {
            key: "page-layout42",
            label: "基本信息",
          },
          {
            key: "page-layout43",
            label: "修改密码",
          },
        ],
      },
    ]);
  }, []);

  return (
    <LayoutWrapper
      header={<div>header</div>}
      siderProps={{
        mode: LayoutSiderItemMode.VERTICAL,
      }}
    >
      <LayoutDetail title="title">
        <Table
          columns={[
            {
              title: (
                <EditableHeader deletable value={value} onChange={onChange} />
              ),
              dataIndex: "key",
            },
          ]}
        />
      </LayoutDetail>
    </LayoutWrapper>
  );
};

export default DragContainerDemo;
