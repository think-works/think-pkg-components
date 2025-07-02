import { Breadcrumb } from "antd";
import cls, { Argument } from "classnames";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import * as types from "@/utils/types";
import { useMatchCrumbs } from "../hooks";
import stl from "./index.module.less";

export type CrumbProps = {
  className?: Argument;
  style?: React.CSSProperties;
  /*
   * 面包屑模式
   * title 标题模式
   */
  crumbMode?: "title";
  /** 面包屑右侧扩展 */
  crumbExtend?: React.ReactNode;
};

const Crumb = (props: CrumbProps) => {
  const { className, style, crumbMode, crumbExtend } = props;
  const matchCrumbs = useMatchCrumbs();

  const crumbItems = useMemo(
    () =>
      matchCrumbs
        ?.map(({ title, pathname, to, element }, idx) => {
          const last = idx === matchCrumbs.length - 1;
          const key = `${title}-${pathname}-${idx}`;

          // 优先使用自定义组件
          if (element) {
            return {
              key,
              title: element,
            };
          }

          // 没有标题就忽略
          if (!title) {
            return;
          }

          // 不是最后一个允许点击
          if (!last && (to || pathname)) {
            return {
              key,
              title: <Link to={to || pathname || ""}>{title}</Link>,
            };
          }

          return {
            key,
            title,
          };
        })
        .filter(types.truthy),
    [matchCrumbs],
  );

  const crumbCom = useMemo(() => {
    if (!crumbItems?.length) {
      return null;
    }

    return crumbMode === "title" ? (
      <div className={stl.title}>
        {crumbItems?.[crumbItems.length - 1]?.title}
      </div>
    ) : (
      <Breadcrumb items={crumbItems} />
    );
  }, [crumbItems, crumbMode]);

  return (
    <div className={cls(stl.crumb, className)} style={style}>
      <div className={stl.main}>{crumbCom}</div>
      <div className={stl.extend}>{crumbExtend}</div>
    </div>
  );
};

export default Crumb;
