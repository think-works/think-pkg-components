import { Dropdown, Input, InputRef, Popconfirm, Tooltip } from "antd";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MoreOutlined } from "@ant-design/icons";
import { BaseTreeNode, TreeIndexItem } from "@/components/BaseTree";
import { uuid4 } from "@/utils/crypto";
import { TreeFolderIcon } from "./icon/FolderIcon";
import { TreeFolderOpenIcon } from "./icon/FolderOpenIcon";
import style from "./item.module.less";
import { DirectoryNode, DropdownItem, TreeActions } from "./types";

interface Props<T extends BaseTreeNode, NODE_TYPE> {
  /** 节点数据 */
  data: TreeIndexItem<DirectoryNode<T, NODE_TYPE>>;
  /**
   * 当前节点是否被 hover
   */
  hover: boolean;
  /**
   * 里面 创建了虚拟节点
   * @returns
   */
  onUpdate: () => void;
  createTypes?: NODE_TYPE[];
  actions?: TreeActions<DirectoryNode<T, NODE_TYPE>>;

  showNodeCount?: boolean;
  /**
   * 文件夹 icon 内置
   * 这里自定义的是 非文件夹 图标
   * @param node
   * @returns
   */
  renderNodeIcon?: (node: DirectoryNode<T, NODE_TYPE>) => React.ReactNode;
  renderTag?: (node: DirectoryNode<T, NODE_TYPE>) => React.ReactNode;
  renderRight?: (node: DirectoryNode<T, NODE_TYPE>) => React.ReactNode;
  /**
   * 给每个节点处理自己的 DropdownItems
   * @param node
   * @returns
   */
  renderDropdownItems?: (
    node: DirectoryNode<T, NODE_TYPE>,
  ) => DropdownItem<T, NODE_TYPE>[];
  /**
   * 判断文件夹
   * @param node
   * @returns
   */
  isDirectory: (node: NODE_TYPE) => boolean;
}

function XDirectoryNode<T extends BaseTreeNode, NODE_TYPE>(
  props: Props<T, NODE_TYPE>,
) {
  const { data, actions = {}, isDirectory, renderDropdownItems } = props;
  const [value, setValue] = useState(data.node.name);
  const [edit, setEdit] = useState(data.node.temp);
  const [loading, setLoading] = useState(false);
  const [holdOption, setHoldOption] = useState<boolean>(false);
  const ref = useRef<InputRef>(null);
  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 0);
  }, [edit]);

  const isActive = useMemo(() => {
    if (edit) {
      return false;
    }
    if (holdOption === true) {
      return true;
    }
    return props.hover;
  }, [edit, holdOption, props.hover]);
  /**
   *  创建占位节点，等待编辑
   */
  const createNode = useCallback(
    (type: NODE_TYPE, name: string): void => {
      setHoldOption(false);
      if (!data.node.children) {
        data.node.children = [];
      }
      const node: DirectoryNode<T, NODE_TYPE> = {
        name,
        type,
        id: uuid4(),
        parentId: data.node.id,
        temp: true,
      };
      // TODO 先默认插入第一个 插入指定位置还要考虑滚动条区域 我草 没时间搞
      data.node.children.unshift(node);
      // TODO 这属于违规操作 后期优化 应该直接 commit 到 store
      // 因为是临时添加 就算了
      data.expanded = true;
      props.onUpdate();
    },
    [data, props],
  );
  /**
   * 内置编辑
   */
  const onEdit = useCallback(
    async (input: boolean | string = ""): Promise<void> => {
      if (input === true) {
        await setValue(data.node.name);
        setEdit(true);
      } else {
        if (input) data.node.name = input;
        try {
          setLoading(true);
          if (data.node.temp) {
            await props.actions?.create?.(data.node);
            delete data.node.temp;
          } else {
            await props.actions?.rename?.(data.node);
          }
          setEdit(false);
        } catch (e) {
          setEdit(true);
          setTimeout(() => ref.current?.focus(), 0);
        } finally {
          setLoading(false);
        }
      }
    },
    [data.node, props.actions],
  );
  const dropdownMenuItems: MenuItemType[] = useMemo(() => {
    if (renderDropdownItems) {
      return renderDropdownItems(data.node).map((menuItem) => {
        const {
          actionType,
          //@ts-expect-error  type: 'divider' 时不需要 label 在预期内
          label,
          //@ts-expect-error actionType === "create" 才有此值
          createNodeType,
          //@ts-expect-error actionType === "create" 才有此值
          createDefaultName,
          tooltip,
          popConfirm,
          onClick,
          ...others
        } = menuItem;
        let labelNode = label || "";
        const handelItem = () => {
          if (actionType === "create") {
            createNode(createNodeType, createDefaultName);
          } else if (actionType === "rename") {
            onEdit(true);
          } else if (actionType === "copy") {
            actions.copy?.(data.node);
          } else if (actionType === "import") {
            actions.import?.(data.node);
          } else if (actionType === "delete") {
            actions.delete?.(data.node);
          }
          onClick?.(data.node);
        };

        if (tooltip) {
          labelNode = <Tooltip title="tooltip">{labelNode}</Tooltip>;
        }

        if (popConfirm) {
          labelNode = (
            <Popconfirm title={popConfirm} onConfirm={handelItem}>
              {labelNode}
            </Popconfirm>
          );
        }
        return {
          ...others,
          label: labelNode,
          onClick: (e) => {
            if (!tooltip && !popConfirm) {
              handelItem();
            } else if (popConfirm) {
              //@ts-expect-error 阻止冒泡，避免 Popconfirm 出来时 Dropdown 关闭
              e.stopPropagation();
            }
          },
        };
      });
    }
    return [];
  }, [renderDropdownItems, data.node, createNode, onEdit, actions]);

  const renderRight = () => {
    if (props.renderRight) {
      return props.renderRight(data.node);
    }
    if (props.showNodeCount) {
      const loop = (node: DirectoryNode<T, NODE_TYPE>[]): number => {
        let count = 0;
        node.forEach((item) => {
          if (!isDirectory(item.type)) {
            count += 1;
          }
          if (item.children) {
            count += loop(item.children);
          }
        });
        return count;
      };

      let nodeCount = 0;
      if (data.node.children) {
        nodeCount = loop(data.node.children);
      }
      return (
        <span className={style["item-right-nodeCount"]}>
          {nodeCount > 0 ? nodeCount : ""}
        </span>
      );
    }
    return (
      <div
        onClick={(e) => e.stopPropagation()}
        className={style["item-right"]}
        style={{ display: isActive ? "block" : "none" }}
      >
        {!!dropdownMenuItems.length && (
          <Dropdown
            menu={{
              items: dropdownMenuItems,
            }}
            onOpenChange={(e) => setHoldOption(e)}
          >
            <MoreOutlined />
          </Dropdown>
        )}
      </div>
    );
  };

  const onDragstart = (e: any): void => {
    if (edit) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  return (
    <div className={style.item}>
      <div className={style["item-icon"]}>
        {isDirectory(data.node.type) ? (
          data.expanded ? (
            <TreeFolderOpenIcon />
          ) : (
            <TreeFolderIcon />
          )
        ) : (
          props.renderNodeIcon && props.renderNodeIcon(data.node)
        )}
      </div>
      <div className={style["item-tag"]}>
        {props.renderTag && props.renderTag(data.node)}
      </div>

      <div
        className={style["item-name"]}
        onDragStart={onDragstart}
        draggable={edit}
      >
        {edit ? (
          <Input
            size="small"
            disabled={loading}
            ref={ref}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onEdit(value);
              }
            }}
            onBlur={() => {
              onEdit(value);
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className={style["item-edit"]}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        ) : (
          <span
            className={style["item-name-text"]}
            style={{ color: data.node.color }}
          >
            {data.node.name}
          </span>
        )}
      </div>

      {renderRight()}
    </div>
  );
}

export default XDirectoryNode;
