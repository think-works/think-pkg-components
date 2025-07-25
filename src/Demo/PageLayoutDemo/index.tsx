import { Breadcrumb, Descriptions, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { HomeFilled } from "@ant-design/icons";
import {
  BaseAction,
  EditableTable,
  LayoutDetail,
  LayoutPanel,
  LayoutWrapper,
  LayoutWrapperSiderMode,
  layoutWrapperUtils,
} from "@/components";
import { StatisticsCard } from "@/components/StatisticsCard";
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
        activeIcon: <HomeFilled style={{ color: "green" }} />,
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
      footer={<div>footer</div>}
      siderProps={{
        mode: LayoutWrapperSiderMode.VERTICAL,
      }}
    >
      <LayoutPanel styles={{ body: { paddingLeft: 0 } }}>
        <LayoutDetail
          // entityColor={false}
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
              column={4}
              size="small"
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
          statistic={
            <Space>
              <StatisticsCard
                title="总销售额"
                value={112893}
                icon={<OverviewSvg />}
                shadowColor="red"
                onJump={() => {}}
              />
              <StatisticsCard
                title="总销售额"
                value={9009123211}
                valueStyle={{
                  fontSize: 30,
                  fontWeight: "400",
                  color: "#FF4500",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                icon={<OverviewSvg />}
                shadowColor="red"
                onJump={() => {}}
              />
            </Space>
          }
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
