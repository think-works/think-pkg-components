import type { TableColumnType } from "antd";
import { useMemo, useState } from "react";
import { EditableTable } from "@/components";

const { EditableHeader } = EditableTable;

const EditableTableDemo = () => {
  const [readOnly] = useState<boolean>(false);
  const [indexTitle, setIndexTitle] = useState("序号");
  const [data, setDataSource] = useState<any[]>([
    {
      description: "查询条件：记录名称、状态、执行人、执行时间",
      expectedResult: { text: "得到对应的查询结果" },
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

  const columns: TableColumnType<any>[] = useMemo(() => {
    const list: TableColumnType<any>[] = [
      {
        title: (
          <EditableHeader
            value={indexTitle}
            deletable={{ popconfirm: "确定删除序号列吗？" }}
            onChange={(e) => setIndexTitle(e.target.value)}
            onDelete={() => {
              alert("删除序号列");
            }}
          />
        ),
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
          return readOnly ? (
            value
          ) : (
            <EditableTable.DecoupleTextArea autoSize value={value} />
          );
        },
      },
      {
        title: "预期结果",
        dataIndex: "expectedResult",
        render: (value: string) => {
          return readOnly ? (
            value
          ) : (
            <EditableTable.DecoupleTextArea autoSize value={value} />
          );
        },
      },
      {
        title: "DecoupleAutoComplete",
        dataIndex: "expectedResult",
        render: (value: string) => {
          return readOnly ? (
            value
          ) : (
            <EditableTable.DecoupleAutoComplete
              value={value}
              options={[
                { value: "Burns Bay Road" },
                { value: "Downing Street" },
                { value: "Wall Street" },
              ]}
            />
          );
        },
      },
    ];

    return list;
  }, [indexTitle, readOnly]);

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
      // readOnly={readOnly}
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
