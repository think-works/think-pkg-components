import { Table } from "antd";
import { useEffect, useState } from "react";
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
        label: "page-layout2",
        children: [
          {
            key: "page-layout",
            label: "page-layout",
          },
        ],
      },
      {
        key: "page-layout3",
        label: "page-layout3",
        children: [
          {
            key: "page-layout4",
            label: "page-layout4",
          },
        ],
      },
    ]);
  }, []);

  return (
    <LayoutWrapper header={<div>header</div>}>
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
    </LayoutWrapper>
  );
};

export default DragContainerDemo;
