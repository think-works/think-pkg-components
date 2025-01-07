import { Checkbox, Dropdown, Menu } from "antd";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import stl from "./index.module.less";
import {
  BaseTreeIndexItem,
  BaseTreeItemContext,
  BaseTreeKey,
  BaseTreeMenuActions,
  BaseTreeNode,
} from "./types";

export interface BaseTreeNodeProps<BaseNode extends BaseTreeNode> {
  data: BaseTreeIndexItem<BaseNode>;
  onCheck: (checked: boolean) => void;
  onClick: () => void;
  onExpand: (expanded: boolean) => void;
  canActiveKey?: ((key: BaseTreeKey, node: BaseNode) => boolean) | undefined;
  checkable?: boolean;
  activeKey?: BaseTreeKey;
  renderContent?: (
    data: BaseTreeIndexItem<BaseNode>,
    context: BaseTreeItemContext,
    onExpand: (expanded: boolean) => void,
  ) => React.ReactNode;
  dropAttrs: React.HTMLAttributes<HTMLDivElement>;
  /** 拖拽背景高亮 */
  dragHighlight?: boolean;
  /** 点击节点无效 */
  disabledNodeClick?: boolean;
  /** 右键操作 */
  menu?: BaseTreeMenuActions;
  showIndentBorder?: boolean;
}

const TreeNode = <BaseNode extends BaseTreeNode>(
  props: BaseTreeNodeProps<BaseNode>,
) => {
  const { data, onCheck, menu, canActiveKey } = props;
  const [hover, setHover] = useState(false);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);

  // .item__menu {
  //   border: 1px solid red;
  // }

  // 是否可以展开的逻辑
  const canExpand = (): boolean => {
    if (typeof data.node.isLeaf === "function") {
      // isLeaf 是个函数
      return data.node.isLeaf(data.node);
    }
    if (typeof data.node.isLeaf === "boolean") {
      // 设置为 isLeaf 一定不允许展开
      return !data.node.isLeaf;
    }
    // if (data.node.load) { // 有了 异步加载 就可以展开
    //   return true;
    // }
    // 其余时候根据是否有 children
    return data.node.children ? data.node.children.length > 0 : false;
  };
  // 绘图
  const renderIcon = () => {
    // if (this.loading) {
    //   return <a-icon class="loading" type="loading" />;
    // }
    if (!canExpand()) {
      return null;
    }
    if (data.expanded) {
      return <CaretDownOutlined />;
    }
    return <CaretRightOutlined />;
  };

  const switchExpand = (expanded: boolean) => {
    props.onExpand(expanded);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.stopPropagation();
    if ((!canActiveKey || !canActiveKey(data.key, data.node)) && canExpand()) {
      switchExpand(!data.expanded);
    }
    // if (this.loading || this.node.disabled || this.node.status === NODE_STATUS.EDIT) {
    //   return;
    // }
    props.onClick();
  };

  const onExpanded = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (canExpand()) switchExpand(!data.expanded);
  };

  const renderContent = () => {
    if (props.renderContent) {
      return props.renderContent(data, { hover }, props.onExpand);
    }
    return data.node.name;
  };

  /**
   * 暂时二级级联 这组件有问题吧
   */
  const contextMenu = useMemo(() => {
    const innerMenu = typeof menu === "function" ? menu(data.node) : menu;
    if (innerMenu) {
      return (
        <Menu
          className={stl["x-tree-node__dropdown"]}
          subMenuCloseDelay={0.1}
          subMenuOpenDelay={0.2}
          onClick={() => {
            setContextMenuOpen(false);
          }}
        >
          {innerMenu.map((item, index) => {
            if (item.divider) {
              return <Menu.Divider key={index} />;
            }
            if (!item.subMenu) {
              return (
                <Menu.Item
                  disabled={item.disabled}
                  key={index}
                  onClick={(info) => {
                    info.domEvent.stopPropagation();
                    item?.onClick?.(data.node);
                  }}
                >
                  {item.label}
                </Menu.Item>
              );
            }
            return (
              <Menu.SubMenu
                disabled={item.disabled}
                title={item.label}
                key={index}
              >
                {(item.subMenu || []).map((subMenu, idx) => {
                  if (subMenu.divider) {
                    return <Menu.Divider key={`sub-${idx}`} />;
                  }
                  return (
                    <Menu.Item
                      key={`sub-${idx}`}
                      onClick={(info) => {
                        info.domEvent.stopPropagation();
                        subMenu?.onClick?.(data.node);
                      }}
                    >
                      {subMenu.label}
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          })}
        </Menu>
      );
    }
    return null;
  }, [data.node, menu]);

  const renderNode = () => {
    return (
      <div
        {...props.dropAttrs}
        className={classNames(stl["x-tree-node"], {
          [stl["drag-over"]]: props.dragHighlight,
          [stl["context"]]: contextMenuOpen,
        })}
        // style={{ paddingLeft: 16 * (props.data.deep - 1) }}
      >
        <div
          className={stl["x-tree-indent"]}
          style={{ width: 16 * (data.deep - 1) }}
        >
          {props.showIndentBorder &&
            Array.from({ length: data.deep - 1 }).map((_, index) => {
              return <div key={index} className={stl["x-tree-indent-unit"]} />;
            })}
        </div>
        <div
          onMouseLeave={() => setHover(false)}
          onMouseEnter={() => setHover(true)}
          title={data?.node?.name?.toString()}
          className={classNames({
            [stl["x-tree-item"]]: true,
            [stl["active"]]: data.key === props.activeKey,
            [stl["search"]]: data.searched,
          })}
          onClick={(e) => onClick(e)}
        >
          <div className={stl["x-tree-item-icon"]} onClick={onExpanded}>
            {renderIcon()}
          </div>
          {props.checkable && (
            <div className={stl["x-tree-item-checkbox"]}>
              <Checkbox
                disabled={data.disabled}
                indeterminate={data.indeterminate}
                checked={data.checked}
                onChange={(e) => onCheck(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div
            className={stl["x-tree-item-content"]}
            onClick={(e) => {
              if (props.disabledNodeClick) {
                e.stopPropagation();
                props.onClick();
              }
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    );
  };

  if (contextMenu) {
    return (
      <Dropdown
        trigger={["contextMenu"]}
        // dropdownRender={()=>contextMenu}
        onOpenChange={(open) => {
          setContextMenuOpen(open);
        }}
      >
        {renderNode()}
      </Dropdown>
    );
  }
  return renderNode();
};

export default TreeNode;
