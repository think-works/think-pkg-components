import { GetProp, Input, TreeDataNode } from "antd";
import cls, { Argument } from "classnames";
import { cloneDeep, merge } from "lodash-es";
import {
  CSSProperties,
  FocusEventHandler,
  ForwardedRef,
  forwardRef,
  Key,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { uuid4 } from "@/utils/cryptos";
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
    /** 修改目标节点 */
    diffTargetNode?: Record<string, any>;
  },
) => Promise<boolean> | boolean | undefined;

export type EditableAllowAction =
  | boolean
  | ((
      /** 修改前的目标节点 */
      targetNode?: TreeDataNode,
    ) => Promise<boolean> | boolean | undefined);

export type EditableTreeRef = {
  /** 滚动树 */
  scrollTo?: ResizeTreeRef["scrollTo"];
  /** 新增节点 */
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
        /** 深度克隆(默认为 true) */
        cloneData?: boolean;
        /** 新增 */
        add?: EditableAllowAction;
        /** 编辑 */
        edit?: EditableAllowAction;
        /** 删除 */
        delete?: EditableAllowAction;
        /** 移动 */
        move?: EditableAllowAction;
      };
  /** 树数据变化 */
  onTreeDataChange?: (
    /** 目标树数据 */
    targetTreeData: TreeDataNode[],
    options: {
      /** 操作类型 */
      action: "add" | "edit" | "delete" | "move";
      /** 修改后的目标节点 */
      targetNode?: TreeDataNode;
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

    treeData: outerTreeData,
    fieldNames,
    onDrop,
    ...rest
  } = props;

  const {
    cloneData = true,
    add: allowAdd,
    edit: allowEdit,
    delete: allowDelete,
    move: allowMove,
  } = editable === true
    ? { cloneData: true, add: true, edit: true, delete: true, move: true }
    : editable || {};

  // #region 导出 Ref

  const refTree = useRef<ResizeTreeRef>(null);

  /**
   * 直接多层 ref 透传函数，祖父组件调用孙组件函数时，会访问到旧版闭包数据。
   * 至少需要在直接父级组件中用函数包装一次，祖父组件才会访问到新版闭包数据。
   */
  useImperativeHandle(ref, () => ({
    scrollTo: (...args) => refTree.current?.scrollTo(...args),

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

  const [editingState, setEditingState] = useState<{
    /** 操作类型 */
    action: "add" | "edit";
    /** 目标树数据 */
    targetTreeData: TreeDataNode[];
    /** 目标节点 key */
    targetKey: Key;
    /** 目标节点 */
    targetNode: TreeDataNode;
  }>();
  const editingKey = editingState?.targetKey;

  /** 克隆树数据 */
  const cloneTreeData = useCallback(
    () => (cloneData ? cloneDeep(innerTreeData) : innerTreeData) || [],
    [cloneData, innerTreeData],
  );

  /** 向指定节点(未找到则为根节点)下新增节点 */
  const handleAddNode = useCallback<EditableCommand>(
    async (targetKey, options) => {
      const { diffTargetNode } = options || {};

      if (!allowAdd) {
        return false;
      }

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

      // 是否可操作
      const allowAction =
        typeof allowAdd === "function" ? await allowAdd(targetNode) : allowAdd;

      // 不允许操作
      if (!allowAction) {
        return false;
      }

      // 新节点
      const newTargetNode: TreeDataNode = {
        key: newTargetKey,
        title: "",
        [fieldNameKey]: newTargetKey,
        [fieldNameTitle]: "",
      };

      // 编辑节点
      merge(newTargetNode, diffTargetNode);

      if (!targetNode) {
        // 添加到根节点下
        targetTreeData.unshift(newTargetNode);
      } else {
        // 添加到目标节点下
        const _targetNode = targetNode as Record<string, any>;
        _targetNode[fieldNameChildren] = _targetNode[fieldNameChildren] || [];
        _targetNode[fieldNameChildren].unshift(newTargetNode);
      }

      // 进入编辑状态
      setEditingState({
        action: "add",
        targetTreeData,
        targetKey: newTargetKey,
        targetNode: newTargetNode,
      });

      // 浅层复制
      const _targetTreeData = [...targetTreeData];

      // 更新内部数据
      setInnerTreeData(_targetTreeData);

      return true;
    },
    [allowAdd, cloneTreeData, fieldNames],
  );

  /** 编辑指定节点 */
  const handleEditNode = useCallback<EditableCommand>(
    async (targetKey, options) => {
      const { diffTargetNode } = options || {};

      if (!allowEdit) {
        return false;
      }

      if (!targetKey) {
        return false;
      }

      // 目标树数据
      const targetTreeData = cloneTreeData();

      // 查找目标节点
      const { node: targetNode } =
        findTreeNodes(targetTreeData, targetKey, fieldNames) || {};

      // 是否可操作
      const allowAction =
        typeof allowEdit === "function"
          ? await allowEdit(targetNode)
          : allowEdit;

      // 不允许操作
      if (!allowAction) {
        return false;
      }

      // 未找到目标
      if (!targetNode) {
        return false;
      }

      // 编辑节点
      merge(targetNode, diffTargetNode);

      // 进入编辑状态
      setEditingState({
        action: "edit",
        targetTreeData,
        targetKey,
        targetNode,
      });

      return true;
    },
    [allowEdit, cloneTreeData, fieldNames],
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

      const { action, targetTreeData, targetNode } = editingState;

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
      onTreeDataChange?.(_targetTreeData, { action, targetNode });

      // 退出编辑
      setEditingState(undefined);
    },
    [editingState, fieldNames, onTreeDataChange],
  );

  /** 删除指定节点 */
  const handleDeleteNode = useCallback<EditableCommand>(
    async (targetKey) => {
      if (!allowDelete) {
        return false;
      }

      if (!targetKey) {
        return false;
      }

      // 目标树数据
      const targetTreeData = cloneTreeData();

      // 查找目标节点
      const {
        node: targetNode,
        index: targetIndex,
        siblings: targetSibling,
      } = findTreeNodes(targetTreeData, targetKey, fieldNames) || {};

      // 是否可操作
      const allowAction =
        typeof allowDelete === "function"
          ? await allowDelete(targetNode)
          : allowDelete;

      // 不允许操作
      if (!allowAction) {
        return false;
      }

      // 未找到目标
      if (!targetNode) {
        return false;
      }

      // 删除节点
      if (targetSibling && targetIndex !== undefined) {
        targetSibling.splice(targetIndex, 1);
      }

      // 浅层复制
      const _targetTreeData = [...targetTreeData];

      // 更新内部数据
      setInnerTreeData(_targetTreeData);

      // 触发外部变更
      onTreeDataChange?.(_targetTreeData, { action: "delete", targetNode });

      return true;
    },
    [allowDelete, cloneTreeData, fieldNames, onTreeDataChange],
  );

  /** 移动指定节点 */
  const handleDrop = useCallback<GetProp<ResizeTreeProps, "onDrop">>(
    async (info, ...rest) => {
      onDrop?.(info, ...rest);

      // 是否可操作
      const allowAction =
        typeof allowMove === "function"
          ? await allowMove(info.dragNode)
          : allowMove;

      // 不允许操作
      if (!allowAction) {
        return false;
      }

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

      if (info.dropToGap) {
        // 与放置节点同级
        if (dropPosition === -1) {
          // 在放置节点前面
          dropSibling.splice(dropIndex, 0, dragNode);
        } else {
          // 在放置节点后面
          dropSibling.splice(dropIndex + 1, 0, dragNode);
        }
      } else {
        // 在放置节点子级
        const _dropNode = dropNode as Record<string, any>;
        _dropNode[fieldNameChildren] = _dropNode[fieldNameChildren] || [];
        _dropNode[fieldNameChildren].unshift(dragNode);
      }

      // #endregion

      // 浅层复制
      const _targetTreeData = [...targetTreeData];

      // 更新内部数据
      setInnerTreeData(_targetTreeData);

      // 触发外部变更
      onTreeDataChange?.(_targetTreeData, {
        action: "move",
        targetNode: dropNode,
      });
    },
    [allowMove, cloneTreeData, fieldNames, onDrop, onTreeDataChange],
  );

  // #endregion

  // #region 渲染节点

  /** 节点标题渲染 */
  const handleNodeTitleRender = useCallback<ResizeNodeRender>(
    (nodeData, ...rest) => {
      const { normalKey, normalTitle } = getFieldValues(nodeData, fieldNames);

      // 优先使用外部属性
      let child =
        typeof normalTitle === "function"
          ? normalTitle(nodeData, ...rest)
          : normalTitle;

      if (nodeTitleRender) {
        child = nodeTitleRender(nodeData, ...rest);
      }

      // 仅支持编辑纯文本节点
      if (editingKey && editingKey === normalKey && typeof child === "string") {
        return (
          <Input
            autoFocus
            size="small"
            defaultValue={child}
            onBlur={handleInputBlur}
            onClick={(e) => {
              // 避免选中树节点
              e.stopPropagation();
            }}
          />
        );
      }

      return child;
    },
    [editingKey, fieldNames, handleInputBlur, nodeTitleRender],
  );

  // #endregion

  return (
    <div className={cls(stl.editableTree, className)} style={style}>
      <ResizeTree
        ref={refTree}
        className={cls(stl.resizeTree, classNames?.resize)}
        style={styles?.resize}
        draggable={!!allowMove}
        treeData={innerTreeData}
        fieldNames={fieldNames}
        onDrop={handleDrop}
        nodeTitleRender={handleNodeTitleRender}
        {...rest}
      />
    </div>
  );
});

export default EditableTree;
