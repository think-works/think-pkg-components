import { Breadcrumb, Descriptions, Table } from "antd";
import { useEffect, useState } from "react";
import { HomeFilled } from "@ant-design/icons";
import {
  BaseAction,
  EditableTable,
  LayoutDetail,
  LayoutPanel,
  LayoutSiderItemMode,
  LayoutWrapper,
  layoutWrapperUtils,
} from "@/components";
import { ReactComponent as OverviewSvg } from "./Logo/overview.svg";

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
        icon: <OverviewSvg />,
        activeIcon: <HomeFilled style={{ color: "red" }} />,
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
        icon: <OverviewSvg />,
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
      <LayoutPanel styles={{ body: { paddingLeft: 0 } }}>
        <LayoutDetail
          title="title"
          crumb={
            <Breadcrumb
              items={[
                {
                  title: "Users",
                },
                {
                  title: ":id",
                  href: "",
                },
              ]}
              params={{ id: 1 }}
            />
          }
          description={
            <Descriptions
              items={[
                {
                  key: "1",
                  label: "UserName",
                  children: "Zhou Maomao",
                },
                {
                  key: "2",
                  label: "Telephone",
                  children: "1810000000",
                },
                {
                  key: "3",
                  label: "Live",
                  children: "Hangzhou, Zhejiang",
                },
                {
                  key: "4",
                  label: "Remark",
                  children: "empty",
                },
                {
                  key: "5",
                  label: "Address",
                  children:
                    "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
                },
              ]}
            />
          }
          statistic={<div>statistic</div>}
          action={<BaseAction type="primary">操作</BaseAction>}
        >
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
      </LayoutPanel>
    </LayoutWrapper>
  );
};

export default DragContainerDemo;
