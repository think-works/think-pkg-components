import { Button, Space } from "antd";
import { useState } from "react";
import { DeleteFilled, FileAddOutlined } from "@ant-design/icons";
import {
  DirectoryTreeDropdownItem,
  /*DirectoryTreeNode,*/
} from "@/components/_export";
import DirectoryTree from "@/components/DirectoryTree";
import DirectoryTreeSearch from "@/components/DirectoryTree/search";

const TreeDemo = () => {
  const [treeData, setTreeData] = useState([
    {
      id: "cd05950f4abd9fb3",
      parentId: "0",
      name: "00-UI自动化",
      type: "DIR",
      children: [
        {
          id: 37,
          parentId: "cd05950f4abd9fb3",
          name: "淘宝下单主流程",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 37,
            name: "淘宝下单主流程",
            priority: 1,
            head: 1,
            archived: true,
            parentId: "cd05950f4abd9fb3",
            gmtCreate: 1715328561079,
            gmtUpdate: 1715328568581,
          },
          children: [],
        },
      ],
    },
    {
      id: "a63a303a0bcc311d",
      parentId: "0",
      name: "000演示模块",
      type: "DIR",
      children: [
        {
          id: 39,
          parentId: "a63a303a0bcc311d",
          name: "AI演示场景",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 39,
            name: "AI演示场景",
            priority: 1,
            head: 6,
            archived: true,
            parentId: "a63a303a0bcc311d",
            gmtCreate: 1716890893584,
            gmtUpdate: 1718678001550,
          },
          children: [],
        },
        {
          id: 42,
          parentId: "a63a303a0bcc311d",
          name: "上传文件场景",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 42,
            name: "上传文件场景",
            priority: 1,
            head: 11,
            archived: true,
            parentId: "a63a303a0bcc311d",
            gmtCreate: 1718785611460,
            gmtUpdate: 1718792722620,
          },
          children: [],
        },
        {
          id: 40,
          parentId: "a63a303a0bcc311d",
          name: "性能Mock服务",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 40,
            name: "性能Mock服务",
            priority: 1,
            head: 10,
            archived: true,
            parentId: "a63a303a0bcc311d",
            gmtCreate: 1718639153694,
            gmtUpdate: 1718640170198,
          },
          children: [],
        },
        {
          id: 38,
          parentId: "a63a303a0bcc311d",
          name: "演示场景",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 38,
            name: "演示场景",
            priority: 1,
            head: 65,
            archived: true,
            parentId: "a63a303a0bcc311d",
            gmtCreate: 1716808659794,
            gmtUpdate: 1718638306850,
          },
          children: [],
        },
      ],
    },
    {
      id: "50c2759d4c9262fe",
      parentId: "0",
      name: "01-单接口测试",
      type: "DIR",
      children: [
        {
          id: "7a24f1de9a6c6a44",
          parentId: "50c2759d4c9262fe",
          name: "11-检查点",
          type: "DIR",
          children: [
            {
              id: 24,
              parentId: "7a24f1de9a6c6a44",
              name: "C102-JSON检查点",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 24,
                name: "C102-JSON检查点",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "7a24f1de9a6c6a44",
                gmtCreate: 1710233515945,
                gmtUpdate: 1710233574704,
              },
              children: [],
            },
          ],
        },
        {
          id: "51c3bc2f6c973b63",
          parentId: "50c2759d4c9262fe",
          name: "12-预处理",
          type: "DIR",
          children: [
            {
              id: 21,
              parentId: "51c3bc2f6c973b63",
              name: " C103-请求加密处理",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 21,
                name: " C103-请求加密处理",
                priority: 1,
                head: 6,
                archived: true,
                parentId: "51c3bc2f6c973b63",
                gmtCreate: 1710233142915,
                gmtUpdate: 1715343422655,
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "a47ceb885bd76f20",
      parentId: "0",
      name: "02-业务流程测试",
      type: "DIR",
      children: [
        {
          id: "62167d4700126f8a",
          parentId: "a47ceb885bd76f20",
          name: "21-多接口流程",
          type: "DIR",
          children: [
            {
              id: 4,
              parentId: "62167d4700126f8a",
              name: "C201-多接口参数关联",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 4,
                name: "C201-多接口参数关联",
                priority: 1,
                head: 5,
                archived: true,
                parentId: "62167d4700126f8a",
                gmtCreate: 1710221308431,
                gmtUpdate: 1715317676362,
              },
              children: [],
            },
          ],
        },
        {
          id: "67f709b79f5d8c42",
          parentId: "a47ceb885bd76f20",
          name: "22-数据驱动流程",
          type: "DIR",
          children: [
            {
              id: 5,
              parentId: "67f709b79f5d8c42",
              name: "C202-静态数据驱动",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 5,
                name: "C202-静态数据驱动",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "67f709b79f5d8c42",
                gmtCreate: 1710221327902,
                gmtUpdate: 1710221597599,
              },
              children: [],
            },
            {
              id: 6,
              parentId: "67f709b79f5d8c42",
              name: "C203-数据库数据驱动",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 6,
                name: "C203-数据库数据驱动",
                priority: 1,
                head: 7,
                archived: true,
                parentId: "67f709b79f5d8c42",
                gmtCreate: 1710221341314,
                gmtUpdate: 1710244140683,
              },
              children: [],
            },
            {
              id: 32,
              parentId: "67f709b79f5d8c42",
              name: "C204-用例数据驱动",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 32,
                name: "C204-用例数据驱动",
                priority: 1,
                head: 3,
                archived: true,
                parentId: "67f709b79f5d8c42",
                gmtCreate: 1710244367727,
                gmtUpdate: 1710244495032,
              },
              children: [],
            },
          ],
        },
        {
          id: "c39d86498b415634",
          parentId: "a47ceb885bd76f20",
          name: "23-逻辑控制流程",
          type: "DIR",
          children: [
            {
              id: 7,
              parentId: "c39d86498b415634",
              name: "C204-业务逻辑判断",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 7,
                name: "C204-业务逻辑判断",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "c39d86498b415634",
                gmtCreate: 1710221353892,
                gmtUpdate: 1710221648189,
              },
              children: [],
            },
            {
              id: 8,
              parentId: "c39d86498b415634",
              name: "C205-轮询逻辑判断",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 8,
                name: "C205-轮询逻辑判断",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "c39d86498b415634",
                gmtCreate: 1710221366610,
                gmtUpdate: 1710221695720,
              },
              children: [],
            },
          ],
        },
        {
          id: "7f5732614ba21da0",
          parentId: "a47ceb885bd76f20",
          name: "24-子功能引用流程",
          type: "DIR",
          children: [
            {
              id: 30,
              parentId: "7f5732614ba21da0",
              name: "C206-子功能嵌套",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 30,
                name: "C206-子功能嵌套",
                priority: 1,
                head: 3,
                archived: true,
                parentId: "7f5732614ba21da0",
                gmtCreate: 1710234770552,
                gmtUpdate: 1710244571324,
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "73b23e2dba93a5b3",
      parentId: "0",
      name: "03-AI流程用例生成",
      type: "DIR",
      children: [
        {
          id: 10,
          parentId: "73b23e2dba93a5b3",
          name: "C302-私有知识生成用例",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 10,
            name: "C302-私有知识生成用例",
            priority: 1,
            head: 2,
            archived: true,
            parentId: "73b23e2dba93a5b3",
            gmtCreate: 1710221404732,
            gmtUpdate: 1710221773386,
          },
          children: [],
        },
      ],
    },
    {
      id: "acd8b55fb4601e78",
      parentId: "0",
      name: "04-UFX-恒生金融交换系统",
      type: "DIR",
      children: [
        {
          id: "2f91a457f17dc734",
          parentId: "acd8b55fb4601e78",
          name: "HTTP服务",
          type: "DIR",
          children: [
            {
              id: 11,
              parentId: "2f91a457f17dc734",
              name: " C401-获取行情市场列表",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 11,
                name: " C401-获取行情市场列表",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "2f91a457f17dc734",
                gmtCreate: 1710221437335,
                gmtUpdate: 1710221803820,
              },
              children: [],
            },
          ],
        },
        {
          id: "b64a625d9420baf9",
          parentId: "acd8b55fb4601e78",
          name: "T2服务",
          type: "DIR",
          children: [
            {
              id: 12,
              parentId: "b64a625d9420baf9",
              name: "337934-客户额度信息查询",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 12,
                name: "337934-客户额度信息查询",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "b64a625d9420baf9",
                gmtCreate: 1710221465640,
                gmtUpdate: 1710221823717,
              },
              children: [],
            },
            {
              id: 13,
              parentId: "b64a625d9420baf9",
              name: "338000-期权代码信息查询",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 13,
                name: "338000-期权代码信息查询",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "b64a625d9420baf9",
                gmtCreate: 1710221477306,
                gmtUpdate: 1710221847456,
              },
              children: [],
            },
            {
              id: 14,
              parentId: "b64a625d9420baf9",
              name: "338003-期权组合策略信息查询",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 14,
                name: "338003-期权组合策略信息查询",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "b64a625d9420baf9",
                gmtCreate: 1710221488690,
                gmtUpdate: 1710221865490,
              },
              children: [],
            },
            {
              id: 15,
              parentId: "b64a625d9420baf9",
              name: "338020-期权成交查询-无成交信息",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 15,
                name: "338020-期权成交查询-无成交信息",
                priority: 1,
                head: 3,
                archived: true,
                parentId: "b64a625d9420baf9",
                gmtCreate: 1710221500879,
                gmtUpdate: 1711548112818,
              },
              children: [],
            },
            {
              id: 16,
              parentId: "b64a625d9420baf9",
              name: "338022-期权资产查询-有可用资产",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 16,
                name: "338022-期权资产查询-有可用资产",
                priority: 1,
                head: 5,
                archived: true,
                parentId: "b64a625d9420baf9",
                gmtCreate: 1710221517043,
                gmtUpdate: 1711547280992,
              },
              children: [],
            },
            {
              id: 17,
              parentId: "b64a625d9420baf9",
              name: "395-期权行情查询-无行情信息",
              type: "CASE",
              data: {
                workspaceId: "w00001",
                projectId: "a4d980",
                caseId: 17,
                name: "395-期权行情查询-无行情信息",
                priority: 1,
                head: 2,
                archived: true,
                parentId: "b64a625d9420baf9",
                gmtCreate: 1710221530402,
                gmtUpdate: 1710221959262,
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: "84d7fbd040df7bde",
      parentId: "0",
      name: "99-玩玩",
      type: "DIR",
      children: [
        {
          id: 43,
          parentId: "84d7fbd040df7bde",
          name: "content-type",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 43,
            name: "content-type",
            priority: 1,
            head: 14,
            archived: true,
            parentId: "84d7fbd040df7bde",
            gmtCreate: 1718855142698,
            gmtUpdate: 1718866409311,
          },
          children: [],
        },
        {
          id: 34,
          parentId: "84d7fbd040df7bde",
          name: "场景",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 34,
            name: "场景",
            priority: 1,
            head: 6,
            archived: true,
            parentId: "84d7fbd040df7bde",
            gmtCreate: 1710589628986,
            gmtUpdate: 1715354798806,
          },
          children: [],
        },
        {
          id: 31,
          parentId: "84d7fbd040df7bde",
          name: "成龙",
          type: "CASE",
          data: {
            workspaceId: "w00001",
            projectId: "a4d980",
            caseId: 31,
            name: "成龙",
            priority: 1,
            head: 10,
            archived: true,
            parentId: "84d7fbd040df7bde",
            gmtCreate: 1710242257143,
            gmtUpdate: 1718851134157,
          },
          children: [],
        },
      ],
    },
  ]);
  const [search, setSearch] = useState("");
  const [expandAll, setExpandAll] = useState<boolean | number>(2);
  const renderDropdownItems = (/*node: DirectoryTreeNode<any, "DIR">*/) => {
    const dropdownList: DirectoryTreeDropdownItem<any, "DIR">[] = [
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
      createNodeType: "DIR",
    });

    return dropdownList;
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
        total={3}
        current={1}
        onChange={(e) => setSearch(e.target.value)}
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
          showNodeCount
          expandAll={expandAll}
          data={treeData as any}
          actions={getActions()}
          canActiveKey={() => true}
          isDirectory={(type) => type === "DIR"}
          renderDropdownItems={renderDropdownItems}
        />
      </div>
    </div>
  );
};

export default TreeDemo;
