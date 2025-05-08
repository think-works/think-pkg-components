import { useVirtualList } from "ahooks";
import classNames from "classnames";
import { cloneDeep } from "lodash-es";
import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForceUpdate } from "@/hooks";
import stl from "./index.module.less";
import TreeNode from "./node";
import {
  BaseTreeIndexItem,
  BaseTreeItemContext,
  BaseTreeKey,
  BaseTreeMenuActions,
  BaseTreeNode,
} from "./types";
import { BaseTreeMatchesSearch, findParentIdsBySearchText } from "./utils";

const isSymbol = (key: unknown): key is symbol => typeof key === "symbol";
const getKey = (
  //@ts-ignore
  func,
  //@ts-ignore
  node,
  index: string | number,
  parent?: string | number,
): BaseTreeKey => {
  let key = "";
  if (func) {
    key = func(node, index, parent);
  }
  if (!key) {
    if (node.key) {
      key = node.key;
    } else if (node.id) {
      key = node.id;
    } else if (parent) {
      key = `${parent}-${index}`;
    } else {
      key = index as string;
    }
  }
  return key;
};
export const kRootNode = Symbol("kRootNode");

export const disabledSome = <BaseNode extends BaseTreeNode>(
  nodes: BaseTreeIndexItem<BaseNode>[],
  length = false,
): boolean => {
  if (nodes.length === 0) {
    // 待定
    return length;
  }
  const some = nodes.some((node) => {
    if (node.disabled === true) {
      return true;
    }
    return disabledSome(node.children, length);
  });
  return some;
};

export const disabledEvery = <BaseNode extends BaseTreeNode>(
  nodes: BaseTreeIndexItem<BaseNode>[],
  length = true,
): boolean => {
  if (nodes.length === 0) {
    return length;
  }
  const every = nodes.every((node) => {
    if (
      node.disabled === true &&
      disabledEvery<BaseNode>(node.children, node.disabled) === true
    ) {
      return true;
    }
    return false;
  });
  return every;
};

export interface BaseTreeRef<BaseNode extends BaseTreeNode> {
  focusReload?: () => void;
  scrollTo?: (index: number) => void;
  scrollToKey?: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  setCurrentDragKey?: (key: string) => void;
  getNodeList?: () => BaseNode[];
  checkAll?: () => void;
}

export interface BaseTreeProps<BaseNode extends BaseTreeNode> {
  data: BaseNode[];
  filter?: (node: BaseNode) => boolean;
  /** 怎么生成 key? */
  rowKey?: (row: BaseNode) => BaseTreeKey;
  /** 展开层级 or 全部 */
  expandAll?: boolean | number;
  /** 显示复选框 */
  checkable?: boolean;
  // disabledKeys
  /** 是否可以选中 */
  canActiveKey?: (key: BaseTreeKey, node: BaseNode) => boolean;
  /** 选中的 key 默认带自动展开上级逻辑 */
  activeKey?: BaseTreeKey;
  onActive?: (key: BaseTreeKey, node: BaseNode) => void;
  /** 非flex布局给高度 虚拟滚动需要高度的 */
  maxHeight?: number;
  className?: string;
  /** 渲染节点 */
  renderContent?: (
    data: BaseTreeIndexItem<BaseNode>,
    context: BaseTreeItemContext,
    onExpand: (expanded: boolean) => void,
  ) => React.ReactNode;
  /** 选中的Keys */
  checkedKeys?: BaseTreeKey[];
  onCheckedKeys?: (
    keys: BaseTreeKey[],
    nodes: BaseNode[],
    node: BaseNode | null,
  ) => void;
  isDisabled?: (node: BaseNode) => boolean;
  /**
   * 用户输入的搜索文本
   */
  searchText?: string;
  /**
   * 搜索文本匹配 字段 过滤
   *
   * 如 不传，默认值 [["name"]] ，过滤 obj.name
   *
   * 如 [["name"], ["data", "parentId"]]
   * 先找 obj.name，如果匹配不上，再 obj.data.parentId 进行过滤
   *
   * 如 [["data", "name"], ["data", "parentId"]]
   * 先找 obj.data.name，如果匹配不上，再 obj.data.parentId 进行过滤
   */
  searchFilterProps?: string[][];
  /** 展开的Keys 受控 */
  expandedKeys?: BaseTreeKey[];
  onExpandedKeys?: (keys: BaseTreeKey[]) => void;
  canDrag?: (
    source: BaseTreeIndexItem<BaseNode>,
    target?: BaseTreeIndexItem<BaseNode>,
  ) => BaseTreeKey | symbol | null;
  onDrag?: (source: BaseNode, target?: BaseNode) => void;
  // onDrop={this.onDrop}
  /** 点击节点无效 */
  disabledNodeClick?: boolean;
  /** 右键操作 */
  menu?: BaseTreeMenuActions;
  showIndentBorder?: boolean;
}

/**
 * 项目内通用树组件
 * 设计目的主要服务于效率工具 确保性能
 * @author William Chan <root@williamchan.me>
 * @param {BaseTreeProps} props
 */
const Tree = <BaseNode extends BaseTreeNode>(
  props: BaseTreeProps<BaseNode>,
  ref: ForwardedRef<BaseTreeRef<BaseNode>>,
) => {
  const {
    expandAll,
    expandedKeys,
    checkedKeys,
    searchText,
    onExpandedKeys,
    searchFilterProps = [["name"]],
  } = props;
  const [data, setData] = useState<BaseNode[]>(props.data);
  const [dragTargetKey, setDragTargetKey] = useState<
    BaseTreeKey | symbol | null
  >(null);
  const [activeKey, setActiveKey] = useState<BaseTreeKey | undefined>(
    props.activeKey,
  );
  const [forceKey, forceUpdate] = useForceUpdate();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<() => void>(() => {});
  // 内部维护的 展开key 索引map
  const controlExpandedKeysRef = useRef(new Map<BaseTreeKey, boolean | null>());
  // 内部维护的 选中key 索引map
  const controlCheckedKeysRef = useRef(new Map<BaseTreeKey, boolean | null>());
  // 内部维护的 拖拽key 索引
  const currentDragKeyRef = useRef<BaseTreeKey | null>(null);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  useEffect(() => {
    setActiveKey(props.activeKey);
  }, [props.activeKey]);

  const [nodeList, treeIndex] = useMemo(() => {
    // 内部维护索引
    const tIndex = new Map<BaseTreeKey, BaseTreeIndexItem<BaseNode>>();
    const expandList = new Map<BaseTreeKey, boolean | null>(
      controlExpandedKeysRef.current,
    );
    const checkedList = new Map<BaseTreeKey, boolean | null>(
      controlCheckedKeysRef.current,
    );
    const disabledList = new Map<BaseTreeKey, boolean | null>();
    const searchedList = new Map<BaseTreeKey, boolean | null>();

    const kNodes: BaseTreeIndexItem<BaseNode>[] = [];

    if (expandedKeys) {
      expandedKeys.forEach((key) => {
        expandList.set(key, true);
      });
    } else {
      const controlExpandedKeys = controlExpandedKeysRef.current;
      controlExpandedKeys.forEach((val, key) => {
        expandList.set(key, val);
      });
    }

    if (checkedKeys) {
      checkedKeys.forEach((key) => {
        checkedList.set(key, true);
      });
    } else {
      const controlCheckedKeys = controlCheckedKeysRef.current;
      controlCheckedKeys.forEach((val, key) => {
        checkedList.set(key, val);
      });
    }

    /**
     * 检查一次子集是否 checked
     * @param nodes
     * @param length
     * @returns
     */
    const checkSome = (
      nodes: BaseTreeIndexItem<BaseNode>[],
      length = false,
    ): boolean => {
      if (nodes.length === 0) {
        return length; // 待定
      }
      const some = nodes.some((node) => {
        if (checkedList.get(node.key) === true) {
          return true;
        }
        return checkSome(node.children, length);
      });
      return some;
    };

    /**
     * 检查所有子集是否 checked
     * @param nodes
     * @param length
     * @returns
     */
    const checkEvery = (
      nodes: BaseTreeIndexItem<BaseNode>[],
      length = false,
    ): boolean => {
      if (nodes.length === 0) {
        return length;
      }
      const every = nodes.every((node) => {
        const checked = !!checkedList.get(node.key);
        return checkEvery(node.children, checked);
      });
      return every;
    };

    const checkIndeterminate = (
      items: BaseTreeIndexItem<BaseNode>[],
    ): boolean => {
      const some = checkSome(items);
      const every = checkEvery(items);
      return some === true && every === false;
    };

    const loop = (
      nodes: BaseNode[],
      parent?: BaseTreeIndexItem<BaseNode>,
      deep = 0,
    ): BaseTreeIndexItem<BaseNode>[] => {
      const treeIndexItem: BaseTreeIndexItem<BaseNode>[] = [];
      nodes.forEach((node: BaseNode, index) => {
        if (props.filter && props.filter(node) === true) {
          return;
        }
        const key = getKey(props.rowKey, node, index, parent && parent.key);
        const nextDeep = deep + 1;
        // if set value, leave it as it is
        if (expandList.get(key) === undefined) {
          if (
            props.expandAll === true ||
            (typeof props.expandAll === "number" && nextDeep <= props.expandAll)
          ) {
            expandList.set(key, true);
          } else {
            expandList.set(key, null);
          }
        }
        if (checkedList.get(key) === undefined) {
          checkedList.set(key, false);
        }
        if (props.isDisabled) {
          disabledList.set(key, props.isDisabled(node));
        }

        if (searchText && typeof node.name === "string") {
          try {
            const isSearched = BaseTreeMatchesSearch(
              node,
              searchText,
              searchFilterProps,
            );
            if (isSearched) {
              searchedList.set(key, true);
            } else {
              searchedList.set(key, false);
            }
          } catch (error) {
            console.error(error);
            searchedList.set(key, false);
          }
        } else {
          searchedList.set(key, false);
        }
        tIndex.set(key, {
          key,
          deep: nextDeep,
          node, // 外部会使用
          checked: !!checkedList.get(key),
          expanded: !!expandList.get(key),
          disabled: !!disabledList.get(key),
          searched: !!searchedList.get(key),
          parent: parent || undefined,
          children: [],
          indeterminate: false,
          isShow: false,
        });
        Object.defineProperty(tIndex.get(key), "disabled", {
          enumerable: false,
          // writable: false,
          configurable: false,
          get: (): boolean => !!disabledList.get(key),
          set: (val) => {
            disabledList.set(key, val);
          },
        });

        Object.defineProperty(tIndex.get(key), "checked", {
          enumerable: false,
          configurable: false,
          get: (): boolean => {
            const indexItem = tIndex.get(key);
            const checked = checkedList.get(key);
            if (checked === false && !tIndex.get(key)?.disabled) {
              if (
                indexItem?.parent &&
                checkedList.get(indexItem.parent.key) === true
              ) {
                checkedList.set(key, true);
              } else if (indexItem?.children) {
                // 这里可能会有一些性能问题
                const checkedAll = checkEvery(indexItem.children, checked);
                checkedList.set(key, checkedAll);
              }
            }
            if (indexItem?.parent && indexItem.parent.disabled === true) {
              disabledList.set(key, true);
            }
            return !!checkedList.get(key);
          },
          set: (val) => {
            checkedList.set(key, val);
            const indexItem = tIndex.get(key);
            if (indexItem) {
              indexItem.children.forEach((item) => {
                const innerKeyItem = tIndex.get(item.key);
                if (innerKeyItem && !innerKeyItem?.disabled) {
                  innerKeyItem.checked = val;
                }
              });
            }
            if (val === false && indexItem?.parent) {
              const loopParent = (
                item: BaseTreeIndexItem<BaseTreeNode>,
              ): void => {
                if (!item.disabled) {
                  checkedList.set(item.key, false);
                }
                if (item.parent) {
                  loopParent(item.parent);
                }
              };
              loopParent(indexItem.parent);
            }
          },
        });
        Object.defineProperty(tIndex.get(key), "expanded", {
          enumerable: false,
          configurable: false,
          get: (): boolean | null => !!expandList.get(key),
          set: (val) => {
            expandList.set(key, val);
          },
        });

        Object.defineProperty(tIndex.get(key), "searched", {
          enumerable: false,
          configurable: false,
          get: (): boolean | null => !!searchedList.get(key),
          set: (val) => {
            searchedList.set(key, val);
          },
        });

        Object.defineProperty(tIndex.get(key), "isShow", {
          enumerable: false,
          configurable: false,
          get: (): boolean | null => {
            const indexItem = tIndex.get(key);
            if (indexItem?.parent) {
              return indexItem.parent?.isShow && indexItem.parent.expanded;
            }
            return true;
          },
        });

        Object.defineProperty(tIndex.get(key), "indeterminate", {
          enumerable: false,
          configurable: false,
          get: (): boolean => {
            const disabledAllA = (
              items: BaseTreeIndexItem<BaseNode>[],
            ): boolean => {
              const some = disabledSome<BaseNode>(items);
              const every = disabledEvery<BaseNode>(items);
              return some === true && every === false;
            };

            const indexItem = tIndex.get(key);
            if (indexItem) {
              const indeterminate = checkIndeterminate(indexItem.children);
              const disabledIndeterminate = disabledAllA(indexItem.children);

              if (indeterminate === true) {
                checkedList.set(key, false);
              } else if (checkEvery(indexItem.children, false)) {
                checkedList.set(key, true);
              }

              if (disabledIndeterminate === true) {
                disabledList.set(key, false);
              } else if (disabledEvery(indexItem.children, false)) {
                disabledList.set(key, true);
              }

              return indeterminate;
            }
            return false;
          },
        });

        const keyItem = tIndex.get(key);

        if (keyItem) {
          kNodes.push(keyItem);
          if (node.children && node.children.length > 0) {
            keyItem.children.push(
              //@ts-expect-error BaseNode 类型
              ...loop(node.children, keyItem, nextDeep),
            );
          }
          treeIndexItem.push(keyItem);
        }
      });
      return treeIndexItem;
    };
    loop(data);
    controlExpandedKeysRef.current = expandList;
    controlCheckedKeysRef.current = checkedList;
    return [kNodes, tIndex];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), forceKey]);

  const nodes = useMemo(() => {
    const nowNodes = nodeList.filter((item) => item.isShow === true);
    return nowNodes;
  }, [nodeList]);

  const onExpand = useCallback(
    (node: BaseTreeIndexItem<BaseNode>, expanded: boolean): void => {
      node.expanded = expanded;
      const expandList: BaseTreeKey[] = [];
      const controlExpandedKeys = controlExpandedKeysRef.current;

      //一个元素收起，他所有的子元素需要全部收起
      if (expanded === false) {
        const nodeChildrenExpandList: BaseTreeKey[] = [];
        //获取当前节点下所有的展开子节点
        const loop = (item: BaseTreeIndexItem<BaseNode>): void => {
          if (item) {
            if (item.children && item.children.length > 0) {
              const treeIndexItem = treeIndex.get(item.key);
              if (treeIndexItem && treeIndexItem.expanded === true) {
                treeIndexItem.expanded = false;
              }
              nodeChildrenExpandList.push(item.key);
              item?.children?.forEach((child) => {
                loop(child);
              });
            }
          }
        };
        loop(node);
      }

      treeIndex.forEach((item) => {
        if (item.expanded === true) {
          expandList.push(item.key);
        }
      });

      controlExpandedKeys.set(node.key, expanded);
      if (onExpandedKeys) {
        onExpandedKeys(expandList);
      } else {
        forceUpdate();
      }
    },
    [forceUpdate, onExpandedKeys, treeIndex],
  );

  const onCheck = (
    node: BaseTreeIndexItem<BaseNode>,
    checked: boolean,
  ): void => {
    node.checked = checked;
    const checkList: BaseTreeKey[] = [];
    const nodes: BaseNode[] = [];
    nodeList.forEach((item) => {
      if (item.checked === true) {
        checkList.push(item.key);
        nodes.push(item.node);
      }
    });
    forceUpdate();
    if (props.onCheckedKeys) props.onCheckedKeys(checkList, nodes, node.node);
  };

  const onClick = (node: BaseTreeIndexItem<BaseNode>): void => {
    if (props.canActiveKey && !props.canActiveKey(node.key, node.node)) {
      return;
    }
    if (!props.onActive) setActiveKey(node.key);
    if (props.onActive) props.onActive(node.key, node.node);
  };

  const [list, scrollTo] = useVirtualList(nodes, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 32,
    overscan: 10,
  });

  scrollRef.current = () => {
    if (activeKey) {
      const index = nodes.findIndex((item) => item.key === activeKey);
      if (index > -1) {
        scrollTo(Math.max(index - 3, 0));
      }
    }
  };

  const getNodeList = () => {
    const list = nodes.map((item) => item.node);
    return list;
  };

  const checkAll = (): void => {
    const checkList: BaseTreeKey[] = [];
    const nodes: BaseNode[] = [];
    nodeList.forEach((item) => {
      if (!item.disabled) {
        checkList.push(item.key);
        nodes.push(item.node);
      }
    });
    if (!props.checkedKeys) {
      const controlCheckedKeys = controlCheckedKeysRef.current;
      controlCheckedKeys.forEach((_, key) => {
        controlCheckedKeys.set(key, true);
      });
      controlCheckedKeysRef.current = controlCheckedKeys;
    }
    if (props.onCheckedKeys) props.onCheckedKeys(checkList, nodes, null);
    forceUpdate();
  };

  /**
   * 滑动并且展开节点
   */
  const scrollAndExtendNode = useCallback(
    (index: number) => {
      const nodeItem = nodes[index];

      if (!nodeItem) {
        return;
      }

      if (nodeItem && nodeItem.parent) {
        const parent = nodeItem.parent;
        nodeItem.expanded = true;
        let parentsNodeItem: BaseTreeIndexItem<BaseNode> | null = null;
        const controlExpandedKeys = controlExpandedKeysRef.current;
        // node 的父节点全展开
        const expandedParentsLoop = (
          item: BaseTreeIndexItem<BaseNode>,
        ): void => {
          item.expanded = true;
          controlExpandedKeys.set(item.key, true);
          parentsNodeItem = item;
          if (item.parent) {
            expandedParentsLoop(item.parent);
          }
        };
        expandedParentsLoop(parent);
        if (parentsNodeItem) {
          forceUpdate();
        }
      }
      setTimeout(() => {
        scrollTo(index);
      }, 0);
    },
    [nodes, forceUpdate, scrollTo],
  );

  //#region 拖拽相关
  const dragHighlightList = useMemo(() => {
    if (!isSymbol(dragTargetKey) && dragTargetKey) {
      const target = treeIndex.get(dragTargetKey);
      if (target) {
        // 自己 包含自己下的所有节点
        const highlightList = { [target.key]: true };
        // const loop = (node: BaseTreeIndexItem) => {
        //   node.children.forEach((item) => {
        //     highlightList[item.key] = true;
        //     if (node.children) loop(item);
        //   });
        // };
        // loop(target);
        return highlightList;
      } else {
        return {};
      }
    }
    return {};
  }, [dragTargetKey, treeIndex]);

  const onDragStart = (e: any, key: BaseTreeKey) => {
    if (props.canDrag) {
      e.stopPropagation();
      currentDragKeyRef.current = key;
    }
  };

  const onDragLeave = (e: any, key: BaseTreeKey | symbol) => {
    if (props.canDrag) {
      if (isSymbol(key) || !dragHighlightList[key]) {
        setDragTargetKey(null);
      }
      e.stopPropagation();
    }
  };

  const onDragOver = (e: any, key: BaseTreeKey | symbol) => {
    if (props.canDrag && currentDragKeyRef.current) {
      const source = treeIndex.get(currentDragKeyRef.current);
      if (isSymbol(key) && source) {
        const uniqueId = props.canDrag(source);
        if (uniqueId === key) {
          setDragTargetKey(uniqueId);
          e.stopPropagation();
          e.preventDefault();
        } else {
          setDragTargetKey(null);
          e.stopPropagation();
        }
      } else if (source) {
        const target = treeIndex.get(key as BaseTreeKey);
        // dragTargetKey
        const uniqueId = props.canDrag(source, target);
        if (uniqueId !== null && uniqueId !== currentDragKeyRef.current) {
          setDragTargetKey(uniqueId);
          e.stopPropagation();
          e.preventDefault();
          // 拖拽到位置自动展开 感觉不太好 待定
          // if (!target.expanded) {
          //   onExpand(target, true);
          // }
        } else {
          setDragTargetKey(null);
          e.stopPropagation();
        }
      }
    }
  };

  const onDrop = (e: any, key: BaseTreeKey | symbol): void => {
    if (props.canDrag && props.onDrag && currentDragKeyRef.current) {
      setDragTargetKey(null);
      e.stopPropagation();
      const source = treeIndex.get(currentDragKeyRef.current);
      const target = treeIndex.get(key as BaseTreeKey);
      if (source) {
        const uniqueId = props.canDrag(source, target);
        if (isSymbol(uniqueId)) {
          props.onDrag(source.node);
        } else if (uniqueId) {
          const result = treeIndex.get(uniqueId);
          if (result) {
            props.onDrag(source.node, result.node);
          }
        }
      }
      currentDragKeyRef.current = null;
    }
  };

  const onDragEnd = () => {
    // e.stopPropagation();
    setDragTargetKey(null);
  };

  //#endregion 拖拽相关结束

  useImperativeHandle(ref, () => ({
    focusReload: () => forceUpdate(),
    containerRef,
    scrollTo: scrollAndExtendNode,
    scrollToKey: () => {
      scrollRef?.current?.();
    },
    setCurrentDragKey: (key: string) => (currentDragKeyRef.current = key),
    getNodeList: getNodeList,
    checkAll,
  }));

  //#region 处理受控

  /** 处理 expandAll 受控 */
  useEffect(() => {
    if (expandAll !== undefined) {
      let controlExpandedKeys = new Map<BaseTreeKey, boolean | null>();
      if (expandAll === false) {
        scrollTo(0);
        if (onExpandedKeys) {
          onExpandedKeys([]);
        }
      } else {
        controlExpandedKeys = controlExpandedKeysRef.current;
        controlExpandedKeys.forEach((_, key) => {
          if (typeof expandAll === "number") {
            const deep = treeIndex.get(key)?.deep;
            if (deep && deep <= expandAll) {
              controlExpandedKeys.set(key, true);
            }
          } else {
            controlExpandedKeys.set(key, expandAll);
          }
        });
      }
      forceUpdate();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandAll, scrollTo]);

  useEffect(() => {
    // 重建索引时默认展开选中的所有上级
    if (activeKey) {
      const active = treeIndex.get(activeKey);

      const controlExpandedKeys = controlExpandedKeysRef.current;
      const expandedKeys: BaseTreeKey[] = [];
      controlExpandedKeys.forEach((val, key) => {
        if (val === true) {
          expandedKeys.push(key);
        }
      });

      if (active && active.parent) {
        const expandedLoop = (item: BaseTreeIndexItem<BaseNode>): void => {
          if (item && item.expanded !== true) {
            expandedKeys.push(item.key);
            controlExpandedKeys.set(item.key, true);
            if (item.parent) {
              expandedLoop(item.parent);
            }
          }
        };
        expandedLoop(active.parent);
        expandedKeys.push(active.key);
        controlExpandedKeys.set(active.key, true);
      }
      onExpandedKeys?.(expandedKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, onExpandedKeys]);

  /** 处理 expandedKeys 受控 */
  useEffect(() => {
    if (expandedKeys) {
      //处理所有key的父节点也展开
      let expandedWithParentKeys = [...expandedKeys];
      expandedKeys.forEach((key) => {
        const item = treeIndex.get(key);
        const expandedLoop = (item: BaseTreeIndexItem<BaseNode>): void => {
          if (item) {
            expandedWithParentKeys.push(item.key);
            if (item.parent) {
              expandedLoop(item.parent);
            }
          }
        };
        if (item?.parent) {
          expandedLoop(item?.parent);
        }
      });

      //去重 expandedWithParentKeys
      expandedWithParentKeys = Array.from(new Set(expandedWithParentKeys));

      const controlExpandedKeys = cloneDeep(controlExpandedKeysRef.current);
      controlExpandedKeys.forEach((_, key) => {
        // 这里照顾之前是 null 的情况，boolean 才会渲染 dom
        if (expandedWithParentKeys.includes(key)) {
          controlExpandedKeys.set(key, true);
        } else if (controlExpandedKeys.get(key) === true) {
          controlExpandedKeys.set(key, false);
        }
      });
      controlExpandedKeysRef.current = controlExpandedKeys;
      forceUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedKeys, forceUpdate]);

  /** 处理 checkedKeys 受控 */
  useEffect(() => {
    if (checkedKeys) {
      const controlCheckedKeys = controlCheckedKeysRef.current;
      controlCheckedKeys.forEach((_, key) => {
        controlCheckedKeys.set(key, checkedKeys.includes(key));
      });
      controlCheckedKeysRef.current = controlCheckedKeys;
      forceUpdate();
    }
  }, [checkedKeys, forceUpdate]);

  /** 处理搜索文案匹配 */
  useEffect(() => {
    if (searchText) {
      const searchedParentIds = findParentIdsBySearchText<BaseNode>(
        data,
        searchText,
        searchFilterProps,
      );
      searchedParentIds?.forEach((key) => {
        controlExpandedKeysRef.current.set(key, true);
      });
      forceUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, forceUpdate, data, JSON.stringify(searchFilterProps)]);

  //#endregion 受控结束
  return (
    <div
      ref={containerRef}
      draggable={false}
      onDragLeave={(e) => onDragLeave(e, kRootNode)}
      onDragOver={(e) => onDragOver(e, kRootNode)}
      onDrop={(e) => onDrop(e, kRootNode)}
      className={classNames([
        stl["x-tree-group"],
        props.className,
        { [stl["drag-over"]]: dragTargetKey === kRootNode },
      ])}
      style={{
        height: props.maxHeight ? "auto" : 0,
        maxHeight: props.maxHeight,
      }}
    >
      <div
        ref={wrapperRef}
        className={stl["x-tree-group-wrapper"]}
        style={{ height: props.maxHeight }}
      >
        {list.map((item) => {
          const dropAttrs = {} as React.HTMLAttributes<HTMLDivElement>;
          if (props.canDrag) {
            dropAttrs.draggable = true;
            dropAttrs.onDrop = (e) => onDrop(e, item.data.key);
            dropAttrs.onDragOver = (e) => onDragOver(e, item.data.key);
            dropAttrs.onDragLeave = (e) => onDragLeave(e, item.data.key);
            dropAttrs.onDragStart = (e) => onDragStart(e, item.data.key);
            dropAttrs.onDragEnd = onDragEnd;
          } else {
            dropAttrs.draggable = false;
          }
          return (
            <TreeNode
              menu={props.menu}
              showIndentBorder={props.showIndentBorder}
              disabledNodeClick={props.disabledNodeClick}
              dropAttrs={dropAttrs}
              onClick={() => onClick(item.data)}
              onCheck={(val) => onCheck(item.data, val)}
              canActiveKey={props.canActiveKey}
              onExpand={(val) => onExpand(item.data, val)}
              data={item.data}
              key={item.data.key}
              checkable={props.checkable}
              activeKey={activeKey}
              renderContent={props.renderContent}
              dragHighlight={dragHighlightList[item.data.key]}
            />
          );
        })}
        <div style={{ height: 32 }}></div>
      </div>
    </div>
  );
};

export default forwardRef(Tree) as <BaseNode extends BaseTreeNode>(
  props: BaseTreeProps<BaseNode> & {
    ref: React.RefObject<BaseTreeRef<BaseNode> | null> | null;
  },
) => React.ReactElement;
