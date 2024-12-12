import { Breadcrumb } from "antd";
import cls, { Argument } from "classnames";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import * as types from "@/utils/types";
import { useMatchCrumbs } from "../hooks";
import stl from "./index.module.less";

/**
 * 面包屑扩展类名
 */
const breadcrumbExtendClass = `Layout-Breadcrumb-Extend-${Date.now()}`;

export type CrumbProps = {
  className?: Argument;
  /*
   * 面包屑模式
   * title 标题模式
   */
  crumbMode?: "title";
};

const Crumb = (props: CrumbProps) => {
  const { className, crumbMode } = props;
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

  if (!crumbItems?.length) {
    return null;
  }

  return (
    <div className={cls(stl.crumb, className)}>
      <div className={stl.text}>
        {crumbMode === "title" ? (
          <div className={stl.title}>
            {crumbItems[crumbItems.length - 1]?.title}
          </div>
        ) : (
          <Breadcrumb items={crumbItems} />
        )}
      </div>
      <div className={cls(stl.extend, breadcrumbExtendClass)} />
    </div>
  );
};

export default Crumb;
