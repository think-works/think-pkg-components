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
  const [checkedKeys, setCheckedKeys] = useState<Key[]>();
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();

  const [selectable, setSelectable] = useState<boolean>(true);
  const [checkable, setCheckable] = useState<boolean>(true);
  const [filterable, setFilterable] = useState<boolean>(true);
  const [showIcon, setShowIcon] = useState<boolean>(true);
  const [leafIcon, setLeafIcon] = useState<string>("true");
  const [editable, setEditable] = useState<boolean>(true);
  const [expandable, setExpandable] = useState<boolean>(true);
  const [expandByTitle, setExpandByTitle] = useState(true);

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
            checkable:
            <Switch checked={checkable} onChange={setCheckable} />
          </div>
          <div>
            filterable:
            <Switch checked={filterable} onChange={setFilterable} />
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
          <div>
            editable:
            <Switch checked={editable} onChange={setEditable} />
          </div>
          <div>
            expandable:
            <Switch checked={expandable} onChange={setExpandable} />
          </div>
          <div>
            expandByTitle:
            <Switch checked={expandByTitle} onChange={setExpandByTitle} />
          </div>
        </Space>
      </div>
      <div style={{ maxHeight: 22, overflow: "auto" }}>
        selectedKey: {JSON.stringify(selectedKeys)}
      </div>
      <div style={{ maxHeight: 22, overflow: "auto" }}>
        checkedKeys: {JSON.stringify(checkedKeys)}
      </div>
      <div style={{ maxHeight: 22, overflow: "auto" }}>
        expandedKeys: {JSON.stringify(expandedKeys)}
      </div>
      <LayoutTree
        style={{ height: 500, width: 400 }}
        ref={refTree}
        title="LayoutTree Demo"
        selectable={selectable}
        checkable={checkable}
        filterable={filterable}
        showIcon={showIcon}
        leafIcon={leafIconCom}
        editable={editable}
        expandable={expandable}
        expandByTitle={expandByTitle}
        treeData={treeData}
        onTreeDataChange={setTreeData}
        onSelect={setSelectedKeys}
        onCheck={(keys) => setCheckedKeys(keys as Key[])}
        onExpand={setExpandedKeys}
        nodeIconRender={() => <StarOutlined />}
        nodeCountRender={(node) => node.children?.length}
      />
    </div>
  );
};

export default LayoutTreeDemo;
