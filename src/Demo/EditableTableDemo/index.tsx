import type { ColumnType } from "antd/lib/table/interface";
import { useMemo, useState } from "react";
import { EditableTable } from "@/components/_export";

const EditableTableDemo = () => {
  const [data, setDataSource] = useState<any[]>([
    {
      description: "查询条件：记录名称、状态、执行人、执行时间",
      expectedResult: "得到对应的查询结果",
    },
    {
      description: "点击表格中的记录名称列1",
      expectedResult: "跳转至对应压测记录详情",
    },
    {
      description: "点击表格中的记录名称列2",
      expectedResult: "跳转至对应压测记录详情",
    },
    {
      description: "点击表格中的记录名称列3",
      expectedResult: "跳转至对应压测记录详情",
    },
    {
      description: "点击表格中的记录名称列4",
      expectedResult: "跳转至对应压测记录详情",
      draggable: false,
    },
    {
      description: "点击表格中的记录名称列5",
      expectedResult: "跳转至对应压测记录详情",
    },
  ]);

  const columns: ColumnType<any>[] = useMemo(() => {
    const list: ColumnType<any>[] = [
      {
        title: "序号",
        align: "center",
        width: 100,
        dataIndex: "index",
        render: (d: string, r: any, index: number) => {
          return <div style={{ textAlign: "center" }}>{index + 1}</div>;
        },
      },
      {
        title: "步骤描述",
        dataIndex: "description",
        render: (value: string) => {
          return <EditableTable.DecoupleTextArea autoSize value={value} />;
        },
      },
      {
        title: "预期结果",
        dataIndex: "expectedResult",
        render: (value: string) => {
          return <EditableTable.DecoupleTextArea autoSize value={value} />;
        },
      },
    ];

    return list;
  }, []);
  const dataSource = useMemo(() => {
    if (data?.length) {
      return data.map((item, index) => {
        return {
          ...item,
          index,
        };
      });
    }
    return [];
  }, [data]);
  return (
    <EditableTable
      //   readOnly={readOnly}
      canDrag
      columns={columns}
      dataSource={dataSource}
      onChange={(value) => {
        setDataSource(value);
      }}
    />
  );
};
export default EditableTableDemo;
