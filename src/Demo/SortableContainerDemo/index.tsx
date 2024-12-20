import { useEffect, useState } from "react";
import { SortableContainer } from "@/components";

const items = [
  {
    key: "张三",
    children: "张三",
  },
  {
    key: "李四",
    children: "李四",
  },
  {
    key: "王五",
    children: "王五",
  },
  {
    key: "马六",
    children: "马六",
  },
];

const SortableContainerDemo = () => {
  const [list, setList] = useState(items);

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

  return <SortableContainer items={localList} onItemChange={handleSort} />;
};

export default SortableContainerDemo;
