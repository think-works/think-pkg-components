import { Button, Select, Space, Switch, TreeDataNode } from "antd";
import { Key, useMemo, useRef, useState } from "react";
import { FileFilled, FileOutlined, StarOutlined } from "@ant-design/icons";
import { DropdownActions, LayoutTree, LayoutTreeRef } from "@/components";

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
  const [expandedKeys, setExpandedKeys] = useState<Key[]>();
  const [selectedKeys, setSelectedKeys] = useState<Key[]>();

  const [filterable, setFilterable] = useState<boolean>(true);
  const [showIcon, setShowIcon] = useState<boolean>(true);
  const [leafIcon, setLeafIcon] = useState<string>("true");
  const [editable, setEditable] = useState<boolean>(false);

  const leafIconCom = useMemo(() => {
    if (leafIcon === "true") {
      return true;
    }
    if (leafIcon === "false") {
      return false;
    }
    if (leafIcon === "ReactNode") {
      return <FileFilled />;
    }
    if (leafIcon === "Function") {
      const func = () => <FileOutlined />;
      return func;
    }
  }, [leafIcon]);

  return (
    <div>
      <div>
        <Space>
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
            <Button
              disabled={!editable}
              onClick={() => {
                refTree.current?.addNode?.(undefined, {
                  diffTargetNode: {
                    title: "默认名称1",
                  },
                });

                // 滚动到第一项
                setTimeout(() => {
                  refTree.current?.scrollTo?.({ index: 0 });
                }, 100);
              }}
            >
              新建
            </Button>
          </div>
        </Space>
      </div>
      <div>selectedKey: {JSON.stringify(selectedKeys)}</div>
      <LayoutTree
        style={{ height: 500, width: 400 }}
        ref={refTree}
        title="LayoutTree Demo"
        filterable={filterable}
        editable={editable}
        showIcon={showIcon}
        leafIcon={leafIconCom}
        treeData={treeData}
        onTreeDataChange={setTreeData}
        expandedKeys={expandedKeys}
        onExpand={setExpandedKeys}
        onSelect={setSelectedKeys}
        nodeIconRender={() => <StarOutlined />}
        nodeCountRender={(node) => node.children?.length}
        nodeActionRender={(node) =>
          !editable ? null : (
            <DropdownActions
              actions={[
                {
                  key: "add",
                  children: "新建",
                  onClick: () => {
                    refTree.current?.addNode?.(node.key, {
                      diffTargetNode: {
                        title: "默认名称2",
                      },
                    });

                    // 展开当前项
                    setExpandedKeys((keys) => [...(keys || []), node.key]);

                    // 滚动到当前项
                    setTimeout(() => {
                      refTree.current?.scrollTo?.({ key: node.key });
                    }, 100);
                  },
                },
                {
                  key: "edit",
                  children: "编辑",
                  onClick: () => {
                    refTree.current?.editNode?.(node.key);
                  },
                },
                {
                  danger: true,
                  key: "delete",
                  children: "删除",
                  popconfirm: {
                    stopPropagation: true,
                    title: "确定删除吗？",
                    onConfirm: () => {
                      refTree.current?.deleteNode?.(node.key);
                    },
                  },
                },
              ]}
            />
          )
        }
      />
    </div>
  );
};

export default LayoutTreeDemo;
