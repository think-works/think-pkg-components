import { Button, Space } from "antd";
import { useRef, useState } from "react";
import { DeleteFilled, FileAddOutlined } from "@ant-design/icons";
import {
  BaseTreeMatchesSearch,
  BaseTreeRef,
  DirectoryTreeDropdownItem,
  /*DirectoryTreeNode,*/
} from "@/components/_export";
import DirectoryTree from "@/components/DirectoryTree";
import DirectoryTreeSearch from "@/components/DirectoryTree/search";
import { treeData as defaultData } from "./data";
import styles from "./index.module.less";

const TreeDemo = () => {
  const [treeData, setTreeData] = useState(defaultData);
  const [expandAll, setExpandAll] = useState<boolean | number>(2);
  const [search, setSearch] = useState<string>("");
  const treeRef = useRef<BaseTreeRef<any>>(null);
  const currentScrollRef = useRef({ list: [], index: 0 });
  const [searchResultIndex, setSearchResultIndex] = useState({
    current: 0,
    total: 0,
  });
  const renderDropdownItems = (/*node: DirectoryTreeNode<any, "DIR">*/) => {
    const dropdownList: DirectoryTreeDropdownItem<any, 1>[] = [
      {
        children: "编辑",
        icon: <DeleteFilled />,
        key: "edit_scene",
        actionType: "rename",
      },
      {
        key: "divider",
        divider: true,
      },
      {
        children: "删除场景",
        icon: <DeleteFilled />,
        key: "delete_scene",
        actionType: "delete",
        danger: true,
        popconfirm: "确认删除吗",
      },
    ];
    dropdownList.unshift({
      children: "新建场景",
      key: "create_scene",
      icon: <FileAddOutlined />,
      actionType: "create",
      align: "left",
      createDefaultName: "场景",
      createNodeType: 1,
    });

    return dropdownList;
  };

  const nameTextClassName = () => {
    return styles.underline;
  };

  const getActions = () => {
    const actions = {
      create: async (item: any) => {
        item.id = String(Math.random());
        setTreeData([...treeData, item]);
      },
    };

    return actions;
  };
  const onLast = () => {
    if (!search) {
      return;
    }
    const { list, index } = currentScrollRef.current;
    const lastIndex = DirectoryTreeSearch.findLastIndex(list, index);

    treeRef.current?.scrollTo?.(lastIndex);
    currentScrollRef.current = {
      index: lastIndex,
      list,
    };
    setSearchResultIndex({
      //@ts-expect-error true
      current: list.indexOf(lastIndex) || 0,
      total: list.length,
    });
  };

  const onPressEnter = async () => {
    if (!search) {
      return;
    }
    const nodes = treeRef.current?.getNodeList?.();
    const scrollIndexList: number[] = [];
    nodes?.forEach((node, i) => {
      if (
        BaseTreeMatchesSearch(node, search, [
          ["name"],
          ["rawData", "data", "primaryKey"],
        ])
      ) {
        scrollIndexList.push(i);
      }
    });
    const { list, index } = currentScrollRef.current;
    let scrollIndex = index;
    if (JSON.stringify(scrollIndexList) === JSON.stringify(list)) {
      scrollIndex = DirectoryTreeSearch.findNextIndex(scrollIndexList, index);
    } else {
      scrollIndex = scrollIndexList[0];
    }

    treeRef.current?.scrollTo?.(scrollIndex);
    currentScrollRef.current = {
      index: scrollIndex,
      //@ts-expect-error true
      list: scrollIndexList,
    };
    setSearchResultIndex({
      current: scrollIndexList.indexOf(scrollIndex),
      total: scrollIndexList.length,
    });
  };
  return (
    <div>
      <Space>
        <Button
          onClick={() => {
            if (expandAll === 2) {
              setExpandAll(true);
            } else {
              setExpandAll(!expandAll);
            }
          }}
        >
          {expandAll === true ? "收起" : "展开"}
        </Button>
      </Space>
      <DirectoryTreeSearch
        value={search}
        onChange={(e) => {
          setSearchResultIndex({
            current: 0,
            total: 0,
          });
          setSearch(e.target.value);
        }}
        inputProps={{
          onPressEnter,
          placeholder: `请输入名称`,
        }}
        onLast={onLast}
        onNext={onPressEnter}
        current={searchResultIndex.current}
        total={searchResultIndex.total}
      />
      <div
        style={{
          overflow: "hidden",
          border: "1px solid #c8c8c8",
          display: "flex",
          flexDirection: "column",
          height: 500,
        }}
      >
        <DirectoryTree
          ref={treeRef}
          showNodeCount
          expandAll={expandAll}
          data={treeData as any}
          actions={getActions()}
          searchFilterProps={[["name"], ["rawData", "data", "primaryKey"]]}
          searchText={search}
          canActiveKey={() => true}
          isDirectory={(type) => type === 1}
          renderDropdownItems={renderDropdownItems}
          nameTextClassName={nameTextClassName}
        />
      </div>
    </div>
  );
};

export default TreeDemo;
