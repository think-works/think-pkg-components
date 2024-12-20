import { useEffect, useState } from "react";
import { SortableTable } from "@/components";

const dataSource = [
  {
    name: "张三",
    age: 3,
  },
  {
    name: "李四",
    age: 4,
  },
  {
    name: "王五",
    age: 5,
  },
  {
    name: "马六",
    age: 6,
  },
];

const columns = [
  {
    dataIndex: "name",
    title: "姓名",
  },
  {
    dataIndex: "age",
    title: "年龄",
  },
];

const SortableTableDemo = () => {
  const [list, setList] = useState(dataSource);

  // 避免因接口延时造成的拖拽排序后闪动
  const [localList, setLocalList] = useState(list);
  useEffect(() => {
    setLocalList(list);
  }, [list]);

  const handleSort = async (items: any[]) => {
    const prevList = localList;

    try {
      setLocalList(items);

      // 模拟接口延时
      setTimeout(() => {
        setList(items);
      }, 1000);
    } catch {
      setLocalList(prevList);
    }
  };

  return (
    <SortableTable
      rowKey="name"
      pagination={false}
      columns={columns}
      dataSource={localList}
      onDataSourceChange={handleSort}
    />
  );
};

export default SortableTableDemo;
