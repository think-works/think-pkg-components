import { GetProp, Input, TreeDataNode, TreeProps } from "antd";
import cls, { Argument } from "classnames";
import { cloneDeep, merge } from "lodash-es";
import {
  CSSProperties,
  FocusEventHandler,
  ForwardedRef,
  forwardRef,
  Key,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useComponentsLocale } from "@/i18n/hooks";
import { uuid4 } from "@/utils/cryptos";
import { BaseActionProps } from "../BaseAction";
import DropdownActions from "../DropdownActions";
import { IconActionAdd, IconActionDelete, IconActionEdit } from "./icons";
import stl from "./index.module.less";
import ResizeTree, {
  ResizeNodeRender,
  ResizeTreeProps,
  ResizeTreeRef,
} from "./ResizeTree";
import { findTreeNodes, getFieldValues } from "./utils";

export type EditableCommand = (
  /** 目标节点 key */
  targetKey?: Key,
  options?: {
    /** 确保节点可见 */
    ensureVisible?: boolean;
    /** 修改目标节点 */
    diffNode?: Record<string, any>;
  },
) => void;

export type EditableAllowAction<T = boolean | BaseActionProps> =
  | T
  | ((
      /** 操作节点 */
      node?: TreeDataNode,
    ) => T);

export type EditableTreeRef = ResizeTreeRef & {
  /** 新建节点 */
  addNode?: EditableCommand;
  /** 编辑节点 */
  editNode?: EditableCommand;
  /** 删除节点 */
  deleteNode?: EditableCommand;
};

export type EditableTreeProps = ResizeTreeProps & {
  className?: string;
  style?: CSSProperties;
  classNames?: ResizeTreeProps["classNames"] & {
    resize?: Argument;
  };
  styles?: ResizeTreeProps["styles"] & {
    resize?: CSSProperties;
  };
  /** 可编辑 */
  editable?:
    | boolean
    | {
        /** 新建 */
        add?: EditableAllowAction;
        /** 编辑 */
        edit?: EditableAllowAction;
        /** 删除 */
        delete?: EditableAllowAction;
        /** 移动 */
        move?: EditableAllowAction<boolean> | { icon?: boolean | ReactNode };
        /** 深度克隆树数据 */
        cloneData?: boolean;
        /** 字符串化的标题 */
        stringifyTitle?: (node: TreeDataNode) => string;
      };
  /** 树数据变化 */
  onTreeDataChange?: (
    /** 树数据 */
    treeData: TreeDataNode[],
    options: {
      /** 操作类型 */
      action: "add" | "edit" | "delete" | "move";
      /** 操作节点 */
      node: TreeDataNode;
      /** 父节点 ID，不返回证明是根节点 */
      parentId?: Key;
    },
  ) => void;
};

export const EditableTree = forwardRef(function EditableTreeCom(
  props: EditableTreeProps,
  ref: ForwardedRef<EditableTreeRef>,
) {
  const {
    className,
    style,
    classNames,
    styles,
    editable,
    onTreeDataChange,
    nodeTitleRender,
    nodeActionRender,

    treeData: outerTreeData,
    fieldNames,
    draggable,
    onDrop,
    ...rest
  } = props;

  const {
    add: allowAdd = !!editable,
    edit: allowEdit = !!editable,
    delete: allowDelete = !!editable,
    move: allowMove = !!editable,
    cloneData = true,
    stringifyTitle,
  } = typeof editable === "object" ? editable : {};

  const { locale } = useComponentsLocale();

  // #region 导出 Ref

  const refTree = useRef<ResizeTreeRef>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: (...args) => refTree.current?.scrollTo?.(...args),

    expandAll: (...args) => refTree.current?.expandAll?.(...args),
    ensureVisible: (...args) => refTree.current?.ensureVisible?.(...args),

    addNode: handleAddNode,
    editNode: handleEditNode,
    deleteNode: handleDeleteNode,
  }));

  // #endregion

  // #region 同步外部属性

  const [innerTreeData, setInnerTreeData] = useState<
    TreeDataNode[] | undefined
  >(outerTreeData);

  useEffect(() => {
    setInnerTreeData(outerTreeData);
  }, [outerTreeData]);

  // #endregion

  // #region 操作节点

  const refTimeout = useRef<any>(undefined);
  useEffect(() => {
    const timer = refTimeout.current;
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [editingState, setEditingState] = useState<{
    /** 操作类型 */
    action: "add" | "edit";
    /** 目标树数据 */
    targetTreeData: TreeDataNode[];
    /** 目标节点 key */
    targetKey: Key;
    /** 目标节点 */
    targetNode: TreeDataNode;
    /** 父节点 ID */
    parentId?: Key;
  }>();
  const editingKey = editingState?.targetKey;

  /** 内部拖拽属性 */
  const innerDraggable = useMemo<GetProp<TreeProps, "draggable">>(() => {
    // 优先使用外部属性
    if (typeof draggable !== "undefined") {
      return draggable;
    }

    // 禁止移动
    if (!allowMove) {
      return false;
    }

    // 允许移动
    const nodeDraggable = (node: TreeDataNode) => {
      // 禁用编辑中的节点拖拽，避免框选文本时冲突。
      const { normalKey } = getFieldValues(node, fieldNames);
      if (normalKey === editingKey) {
        return false;
      }

      // 进一步检查
      if (typeof allowMove === "function") {
        const allowAction = allowMove(node);
        return allowAction;
      }

      return true;
    };

    return {
      ...(typeof allowMove === "object" ? allowMove : {}),
      nodeDraggable,
    };
  }, [allowMove, draggable, editingKey, fieldNames]);

  /** 克隆树数据 */
  const cloneTreeData = useCallback(
    () => (cloneData ? cloneDeep(innerTreeData) : innerTreeData) || [],
    [cloneData, innerTreeData],
  );

  /** 向指定节点(未找到则为根节点)下新建节点 */
  const handleAddNode = useCallback<EditableCommand>(
    (targetKey, options) => {
      const { ensureVisible, diffNode } = options || {};

      const { fieldNameKey, fieldNameTitle, fieldNameChildren } =
        getFieldValues({}, fieldNames);

      // 使用 uuid 作为新目标节点 key
      const newTargetKey = uuid4();

      // 目标树数据
      const targetTreeData = cloneTreeData();

      // 查找目标节点
      const { node: targetNode } =
        findTreeNodes(targetTreeData, targetKey || newTargetKey, fieldNames) ||
        {};

      // 新节点
      const newTargetNode: TreeDataNode = {
        key: newTargetKey,
        title: "",
        [fieldNameKey]: newTargetKey,
        [fieldNameTitle]: "",
      };

      // 编辑节点
      merge(newTargetNode, diffNode);

      // 父节点 ID
      let parentId: Key | undefined;

      if (!targetNode) {
        // 添加到根节点下
        targetTreeData.unshift(newTargetNode);
        parentId = undefined;
      } else {
        // 添加到目标节点下
        const _targetNode = targetNode as Record<string, any>;
        _targetNode[fieldNameChildren] = _targetNode[fieldNameChildren] || [];
        _targetNode[fieldNameChildren].unshift(newTargetNode);
        parentId = targetNode.key;

        // 展开父节点以显示新创建的子节点
        refTree.current?.expandNode?.(targetNode.key);
      }

      // 进入编辑状态
      setEditingState({
        action: "add",
        targetTreeData,
        targetKey: newTargetKey,
        targetNode: newTargetNode,
        parentId,
      });

      // 浅层复制
      const _targetTreeData = [...targetTreeData];

      // 更新内部数据
      setInnerTreeData(_targetTreeData);

      // 确保节点可见
      if (ensureVisible) {
        // 滚动节点(延迟等待数据更新)
        clearTimeout(refTimeout.current);
        refTimeout.current = setTimeout(() => {
          refTree.current?.ensureVisible?.(newTargetKey);
        }, 50);
      }
    },
    [cloneTreeData, fieldNames],
  );

  /** 编辑指定节点 */
  const handleEditNode = useCallback<EditableCommand>(
    (targetKey, options) => {
      const { ensureVisible, diffNode } = options || {};

      if (!targetKey) {
        return;
      }

      // 目标树数据
      const targetTreeData = cloneTreeData();

      // 查找目标节点
      const { node: targetNode, matches } =
        findTreeNodes(targetTreeData, targetKey, fieldNames) || {};

      // 未找到目标
      if (!targetNode) {
        return;
      }

      // 编辑节点
      merge(targetNode, diffNode);

      // 父节点 ID (matches 数组中倒数第二个是父节点)
      const parentNode =
        matches && matches.length > 1 ? matches[matches.length - 2] : undefined;
      const { normalKey: parentKey } = parentNode
        ? getFieldValues(parentNode, fieldNames)
        : { normalKey: undefined };

      // 进入编辑状态
      setEditingState({
        action: "edit",
        targetTreeData,
        targetKey,
        targetNode,
        parentId: parentKey,
      });

      // 确保节点可见
      if (ensureVisible) {
        // 滚动节点(延迟等待数据更新)
        clearTimeout(refTimeout.current);
        refTimeout.current = setTimeout(() => {
          refTree.current?.ensureVisible?.(targetKey);
        }, 50);
      }
    },
    [cloneTreeData, fieldNames],
  );

  /** 输入框失焦 */
  const handleInputBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    (e) => {
      const { fieldNameTitle } = getFieldValues({}, fieldNames);

      const value = e.target.value.trim();

      // 空字符串时退出编辑
      if (!value) {
        setEditingState(undefined);
        return;
      }

      if (!editingState) {
        return;
      }

      const { action, targetTreeData, targetNode, parentId } = editingState;

      // 编辑节点
      merge(targetNode, {
        title: value,
        [fieldNameTitle]: value,
      });

      // 浅层复制
      const _targetTreeData = [...targetTreeData];

      // 更新内部数据
      setInnerTreeData(_targetTreeData);

      // 触发外部变更
      onTreeDataChange?.(_targetTreeData, {
        action,
        node: targetNode,
        parentId,
      });

      // 退出编辑
      setEditingState(undefined);
    },
    [editingState, fieldNames, onTreeDataChange],
  );

  /** 删除指定节点 */
  const handleDeleteNode = useCallback<EditableCommand>(
    (targetKey) => {
      if (!targetKey) {
        return;
      }

      // 目标树数据
      const targetTreeData = cloneTreeData();

      // 查找目标节点
      const {
        node: targetNode,
        index: targetIndex,
        siblings: targetSibling,
        matches,
      } = findTreeNodes(targetTreeData, targetKey, fieldNames) || {};

      // 未找到目标
      if (!targetNode) {
        return;
      }

      // 父节点 ID (matches 数组中倒数第二个是父节点)
      const parentNode =
        matches && matches.length > 1 ? matches[matches.length - 2] : undefined;
      const { normalKey: parentKey } = parentNode
        ? getFieldValues(parentNode, fieldNames)
        : { normalKey: undefined };

      // 删除节点
      if (targetSibling && targetIndex !== undefined) {
        targetSibling.splice(targetIndex, 1);
      }

      // 浅层复制
      const _targetTreeData = [...targetTreeData];

      // 更新内部数据
      setInnerTreeData(_targetTreeData);

      // 触发外部变更
      onTreeDataChange?.(_targetTreeData, {
        action: "delete",
        node: targetNode,
        parentId: parentKey,
      });
    },
    [cloneTreeData, fieldNames, onTreeDataChange],
  );

  /** 移动指定节点 */
  const handleDrop = useCallback<GetProp<ResizeTreeProps, "onDrop">>(
    async (info, ...rest) => {
      onDrop?.(info, ...rest);

      // 目标树数据
      const targetTreeData = cloneTreeData();

      // 查找目标节点
      const { fieldNameChildren } = getFieldValues({}, fieldNames);

      /**
       * 参考官方 demo
       * https://ant.design/components/tree-cn#tree-demo-draggable
       */
      const dragKey = info.dragNode.key;
      const dropKey = info.node.key;
      const dropPos = info.node.pos.split("-");

      // 放置位置(0: 内部 / -1: 前面 / 1: 后面)
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);

      // #region 拖拽节点

      // 拖拽节点
      const {
        node: dragNode,
        index: dragIndex,
        siblings: dragSibling,
      } = findTreeNodes(targetTreeData, dragKey, fieldNames) || {};

      if (!dragNode || dragIndex === undefined || !dragSibling) {
        return;
      }

      // 删除拖拽节点
      dragSibling.splice(dragIndex, 1);

      // #endregion

      // #region 放置节点

      // 放置节点
      const {
        node: dropNode,
        index: dropIndex,
        siblings: dropSibling,
      } = findTreeNodes(targetTreeData, dropKey, fieldNames) || {};

      if (!dropNode || dropIndex === undefined || !dropSibling) {
        return;
      }

      // 新的父节点 ID
      let newParentId: Key | undefined;

      if (info.dropToGap) {
        // 与放置节点同级
        if (dropPosition === -1) {
          // 在放置节点前面
          dropSibling.splice(dropIndex, 0, dragNode);
        } else {
          // 在放置节点后面
          dropSibling.splice(dropIndex + 1, 0, dragNode);
        }

        // 获取放置节点的父节点（与放置节点同级，所以父节点相同）
        const { matches: dropMatches } =
          findTreeNodes(targetTreeData, dropKey, fieldNames) || {};
        const parentNode =
          dropMatches && dropMatches.length > 1
            ? dropMatches[dropMatches.length - 2]
            : undefined;
        const { normalKey: parentKey } = parentNode
          ? getFieldValues(parentNode, fieldNames)
          : { normalKey: undefined };
        newParentId = parentKey;
      } else {
        // 在放置节点子级
        const _dropNode = dropNode as Record<string, any>;
        _dropNode[fieldNameChildren] = _dropNode[fieldNameChildren] || [];
        _dropNode[fieldNameChildren].unshift(dragNode);
        newParentId = dropNode.key;
      }

      // #endregion

      // 浅层复制
      const _targetTreeData = [...targetTreeData];

      // 更新内部数据
      setInnerTreeData(_targetTreeData);

      // 触发外部变更
      onTreeDataChange?.(_targetTreeData, {
        action: "move",
        node: dragNode,
        parentId: newParentId,
      });
    },
    [cloneTreeData, fieldNames, onDrop, onTreeDataChange],
  );

  // #endregion

  // #region 渲染节点

  /** 节点标题渲染 */
  const handleNodeTitleRender = useCallback<ResizeNodeRender>(
    (nodeData, ...rest) => {
      const { normalKey, normalTitle } = getFieldValues(nodeData, fieldNames);

      let child: ReactNode;
      if (typeof stringifyTitle === "function") {
        // 外部函数转换
        child = stringifyTitle(nodeData);
      } else {
        // 转换节点标题(仅支持特定数据结构)
        child =
          typeof normalTitle === "function"
            ? normalTitle(nodeData, ...rest)
            : normalTitle;
        if (nodeTitleRender) {
          child = nodeTitleRender(nodeData, ...rest);
        }
      }

      // 仅支持编辑纯文本节点
      if (editingKey && editingKey === normalKey && typeof child === "string") {
        return (
          <Input
            autoFocus
            size="small"
            defaultValue={child}
            onBlur={handleInputBlur}
            onPressEnter={(e) => {
              // 按下回车键时触发失焦
              (e.target as HTMLInputElement).blur();
            }}
            onClick={(e) => {
              // 避免选中树节点
              e.stopPropagation();
            }}
          />
        );
      }

      return child;
    },
    [editingKey, fieldNames, handleInputBlur, nodeTitleRender, stringifyTitle],
  );

  /** 节点操作渲染 */
  const handleNodeActionRender = useCallback<ResizeNodeRender>(
    (nodeData, ...rest) => {
      if (nodeActionRender) {
        return nodeActionRender(nodeData, ...rest);
      }

      const actions: (BaseActionProps & { key?: Key })[] = [];

      // 新增
      const allowAddAction =
        typeof allowAdd === "function" ? allowAdd(nodeData) : allowAdd;
      if (allowAddAction) {
        const actionProps =
          typeof allowAddAction === "object" ? allowAddAction : {};

        actions.push({
          key: "add",
          children: locale.common.createText,
          icon: <IconActionAdd />,
          onClick: () => {
            handleAddNode(nodeData.key, {
              ensureVisible: true,
              diffNode: { title: locale.LayoutTree.newItem },
            });
          },
          ...actionProps,
        });
      }

      // 编辑
      const allowEditAction =
        typeof allowEdit === "function" ? allowEdit(nodeData) : allowEdit;
      if (allowEditAction) {
        const actionProps =
          typeof allowEditAction === "object" ? allowEditAction : {};

        actions.push({
          key: "edit",
          children: locale.common.editText,
          icon: <IconActionEdit />,
          onClick: () => {
            handleEditNode(nodeData.key, {
              ensureVisible: true,
            });
          },
          ...actionProps,
        });
      }

      // 删除
      const allowDeleteAction =
        typeof allowDelete === "function" ? allowDelete(nodeData) : allowDelete;
      if (allowDeleteAction) {
        const actionProps =
          typeof allowDeleteAction === "object" ? allowDeleteAction : {};

        actions.push({
          key: "delete",
          danger: true,
          children: locale.common.deleteText,
          icon: <IconActionDelete />,
          popconfirm: {
            stopPropagation: true,
            title: locale.common.confirmDelete,
            onConfirm: () => {
              handleDeleteNode(nodeData.key);
            },
          },
          ...actionProps,
        });
      }

      if (actions.length) {
        return <DropdownActions actions={actions} />;
      }
    },
    [
      allowAdd,
      allowDelete,
      allowEdit,
      handleAddNode,
      handleDeleteNode,
      handleEditNode,
      locale.LayoutTree.newItem,
      locale.common.confirmDelete,
      locale.common.createText,
      locale.common.deleteText,
      locale.common.editText,
      nodeActionRender,
    ],
  );

  // #endregion

  return (
    <div className={cls(stl.editableTree, className)} style={style}>
      <ResizeTree
        ref={refTree}
        className={cls(stl.resizeTree, classNames?.resize)}
        style={styles?.resize}
        draggable={innerDraggable}
        treeData={innerTreeData}
        fieldNames={fieldNames}
        onDrop={handleDrop}
        nodeTitleRender={handleNodeTitleRender}
        nodeActionRender={handleNodeActionRender}
        {...rest}
      />
    </div>
  );
});

export default EditableTree;
