import { Button, Input, Space, Tooltip } from "antd";
import { InputProps } from "antd/lib";
import classNames, { Argument } from "classnames";
import { useState } from "react";
import {
  FilterFilled,
  FilterOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { themeToken } from "@/common/theme";
import stl from "./index.module.less";
import { findLastIndex, findNextIndex } from "./utils";

/**
 * 基础操作按钮
 */
export type DirectoryTreeSearchProps = {
  className?: Argument;
  value: string;
  current: number;
  total: number;
  inputProps?: InputProps;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onNext?: () => void;
  onLast?: () => void;
};

export const DirectoryTreeSearch = (props: DirectoryTreeSearchProps) => {
  const {
    current = 0,
    total = 0,
    onChange,
    className,
    value,
    inputProps,
    onNext,
    onLast,
  } = props || {};
  const [showFilter, setShowFilter] = useState(true);
  return (
    <div className={classNames(stl.search, className)}>
      <Input
        prefix={<SearchOutlined />}
        suffix={
          value && showFilter && total > 0 ? (
            <FilterFilled
              style={{ color: themeToken.colorPrimary }}
              className={stl.filter}
              onClick={() => {
                setShowFilter(false);
              }}
            />
          ) : (
            <FilterOutlined
              className={stl.filter}
              onClick={() => {
                setShowFilter(true);
              }}
            />
          )
        }
        className={classNames(stl.searchInput)}
        value={value}
        onChange={onChange}
        {...inputProps}
      />

      <div
        className={classNames(stl.searchBox)}
        style={{ display: value && showFilter && total > 0 ? "block" : "none" }}
      >
        <Space>
          <Tooltip title={current <= 0 ? "" : "上一个"}>
            <Button
              type={"default"}
              disabled={current <= 0}
              size="small"
              onClick={onLast}
              icon={<LeftOutlined />}
            />
          </Tooltip>

          <Tooltip title={current + 1 == total ? "" : "下一个"}>
            <Button
              disabled={current + 1 == total}
              size="small"
              onClick={onNext}
              icon={<RightOutlined />}
            />
          </Tooltip>
          <div className={stl.searchBtnText}>
            {current + 1} / {total}
          </div>
        </Space>
      </div>
    </div>
  );
};
DirectoryTreeSearch.findNextIndex = findNextIndex;
DirectoryTreeSearch.findLastIndex = findLastIndex;

export default DirectoryTreeSearch;
