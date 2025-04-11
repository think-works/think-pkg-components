import { Input, InputRef } from "antd";
import classNames from "classnames";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MoreOutlined } from "@ant-design/icons";
import { uuid4 } from "@/utils/cryptos";
import { BaseTreeIndexItem, BaseTreeNode } from "../BaseTree";
import DropdownActions, { DropdownActionItem } from "../DropdownActions";
import { TreeFolderIcon } from "./icon/FolderIcon";
import { TreeFolderOpenIcon } from "./icon/FolderOpenIcon";
import style from "./item.module.less";
import {
  DirectoryTreeActions,
  DirectoryTreeDropdownItem,
  DirectoryTreeNode,
} from "./types";

export { TreeFolderIcon, TreeFolderOpenIcon };
interface Props<T extends BaseTreeNode, NODE_TYPE> {
  /** 节点数据 */
  data: BaseTreeIndexItem<DirectoryTreeNode<T, NODE_TYPE>>;
  /**
   * 当前节点是否被 hover
   */
  hover: boolean;
  /**
   * 里面 创建了虚拟节点
   * @returns
   */
  onUpdate: () => void;
  /**
   * 展开节点 事件
   * @param expanded
   * @returns
   */
  onExpand: (expanded: boolean) => void;
  createTypes?: NODE_TYPE[];
  actions?: DirectoryTreeActions<DirectoryTreeNode<T, NODE_TYPE>>;

  showNodeCount?: boolean;
  /**
   * name 包装器
   * @param children
   * @returns
   */
  nameWrapper?: (
    children: React.ReactNode,
    node: DirectoryTreeNode<T, NODE_TYPE>,
  ) => React.ReactNode;
  /**
   * 文件夹 icon 内置
   * 这里自定义的是 非文件夹 图标
   * @param node
   * @returns
   */
  renderNodeIcon?: (node: DirectoryTreeNode<T, NODE_TYPE>) => React.ReactNode;
  renderTag?: (node: DirectoryTreeNode<T, NODE_TYPE>) => React.ReactNode;
  renderRight?: (node: DirectoryTreeNode<T, NODE_TYPE>) => React.ReactNode;
  /**
   * 给每个节点处理自己的 DropdownItems
   * @param node
   * @returns
   */
  renderDropdownItems?: (
    node: DirectoryTreeNode<T, NODE_TYPE>,
  ) => DirectoryTreeDropdownItem<T, NODE_TYPE>[];
  /**
   * 判断文件夹
   * @param node
   * @returns
   */
  isDirectory: (node: NODE_TYPE) => boolean;
  /**
   * 自定义文本样式
   * @param node
   * @returns
   */
  nameTextClassName?: (node: DirectoryTreeNode<T, NODE_TYPE>) => string;
}

function XDirectoryNode<T extends BaseTreeNode, NODE_TYPE>(
  props: Props<T, NODE_TYPE>,
) {
  const {
    data,
    actions = {},
    nameWrapper,
    nameTextClassName,
    isDirectory,
    renderDropdownItems,
  } = props;
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
      const node: DirectoryTreeNode<T, NODE_TYPE> = {
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
      props.onExpand(true);
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
        } catch {
          setEdit(true);
          setTimeout(() => ref.current?.focus(), 0);
        } finally {
          setLoading(false);
        }
      }
    },
    [data.node, props.actions],
  );
  const dropdownMenuItems: DropdownActionItem[] = useMemo(() => {
    if (renderDropdownItems) {
      return renderDropdownItems(data.node).map(
        (menuItem: DirectoryTreeDropdownItem<T, NODE_TYPE>) => {
          const {
            actionType,
            //@ts-expect-error actionType === "create" 存在
            createNodeType,
            //@ts-expect-error actionType === "create" 存在
            createDefaultName,
            onClick,
            ...others
          } = menuItem;
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
          if (menuItem.divider) {
            return {
              type: "link",
              ...others,
            };
          }
          return {
            type: "text",
            onClick: handelItem,
            ...others,
          };
        },
      );
    }
    return [];
  }, [renderDropdownItems, data.node, createNode, onEdit, actions]);

  const renderRight = () => {
    if (props.renderRight) {
      return props.renderRight(data.node);
    }

    const renderNodeCount = () => {
      const loop = (node: DirectoryTreeNode<T, NODE_TYPE>[]): number => {
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
    };

    return (
      <div className={style["item-right"]}>
        {props.showNodeCount && renderNodeCount()}
        <div
          onClick={(e) => e.stopPropagation()}
          className={style["item-right-menu"]}
          style={{ display: isActive ? "block" : "none" }}
        >
          {!!dropdownMenuItems.length && (
            <DropdownActions
              actionAlign={"left"}
              actions={dropdownMenuItems}
              onOpenChange={(e) => setHoldOption(e)}
            >
              <MoreOutlined />
            </DropdownActions>
          )}
        </div>
      </div>
    );
  };

  const onDragstart = (e: any): void => {
    if (edit) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const renderLeft = () => {
    return (
      <>
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
              className={classNames(
                style["item-name-text"],
                nameTextClassName?.(data.node),
              )}
              style={{ color: data.node.color }}
            >
              {data.node.name}
            </span>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={style.item}>
      {nameWrapper ? nameWrapper(renderLeft(), data.node) : renderLeft()}
      {renderRight()}
    </div>
  );
}

export default XDirectoryNode;
