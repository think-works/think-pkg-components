import { Table } from "antd";
import { useEffect, useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { LayoutDetail, LayoutSiderItemMode } from "@/components/_export";
import EditableTable from "@/components/EditableTable";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { registerCustomMenus } from "@/components/LayoutWrapper/utils";

const { EditableHeader } = EditableTable;

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
        icon: <HomeOutlined />,
      },
      {
        key: "page-layout3",
        label: "项目",
        icon: <HomeOutlined />,
      },
      {
        key: "page-layout4",
        label: "系统管理",
        icon: <HomeOutlined />,
        children: [
          {
            key: "page-layout",
            label: "配置管理",
          },
        ],
      },
    ]);
  }, []);

  return (
    <LayoutWrapper
      header={<div>header</div>}
      siderProps={{
        mode: LayoutSiderItemMode.HORIZONTAL,
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
