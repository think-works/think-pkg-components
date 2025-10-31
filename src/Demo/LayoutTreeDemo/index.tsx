import { Select, Space, Switch, TreeDataNode } from "antd";
import { Key, useMemo, useRef, useState } from "react";
import { FileFilled, FileOutlined, StarOutlined } from "@ant-design/icons";
import { LayoutTree, LayoutTreeRef } from "@/components";

const dig = (path = "0", level = 3) => {
  const list = [];
  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`;
    const treeNode: TreeDataNode = {
      title: key,
      key,
      xxx: "ooo",
    } as TreeDataNode;

    if (level > 0) {
      treeNode.children = dig(key, level - 1);
    }

    list.push(treeNode);
  }
  return list;
};

const demoData = dig();

const LayoutTreeDemo = () => {
  const refTree = useRef<LayoutTreeRef>(null);

  const [treeData, setTreeData] = useState<TreeDataNode[]>(demoData);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>();

  const [selectable, setSelectable] = useState<boolean>(true);
  const [filterable, setFilterable] = useState<boolean>(true);
  const [editable, setEditable] = useState<boolean>(true);
  const [showIcon, setShowIcon] = useState<boolean>(true);
  const [leafIcon, setLeafIcon] = useState<string>("true");

  const leafIconCom = useMemo(() => {
    if (leafIcon === "true") {
      return true;
    }
    if (leafIcon === "false") {
      return false;
    }
    if (leafIcon === "ReactNode") {
      return <FileOutlined />;
    }
    if (leafIcon === "Function") {
      const func = () => <FileFilled />;
      return func;
    }
  }, [leafIcon]);

  return (
    <div>
      <div>
        <Space>
          <div>
            selectable:
            <Switch checked={selectable} onChange={setSelectable} />
          </div>
          <div>
            filterable:
            <Switch checked={filterable} onChange={setFilterable} />
          </div>
          <div>
            editable:
            <Switch checked={editable} onChange={setEditable} />
          </div>
          <div>
            showIcon:
            <Switch checked={showIcon} onChange={setShowIcon} />
          </div>
          <div>
            leafIcon:
            <Select
              value={leafIcon}
              onChange={setLeafIcon}
              options={[
                {
                  value: "true",
                  label: "true",
                },
                {
                  value: "false",
                  label: "false",
                },
                {
                  value: "ReactNode",
                  label: "ReactNode",
                },
                {
                  value: "Function",
                  label: "Function",
                },
              ]}
            />
          </div>
        </Space>
      </div>
      <div>selectedKey: {JSON.stringify(selectedKeys)}</div>
      <LayoutTree
        style={{ height: 500, width: 400 }}
        ref={refTree}
        title="LayoutTree Demo"
        selectable={selectable}
        filterable={filterable}
        editable={editable}
        showIcon={showIcon}
        leafIcon={leafIconCom}
        treeData={treeData}
        onTreeDataChange={setTreeData}
        onSelect={setSelectedKeys}
        nodeIconRender={() => <StarOutlined />}
        nodeCountRender={(node) => node.children?.length}
      />
    </div>
  );
};

export default LayoutTreeDemo;
