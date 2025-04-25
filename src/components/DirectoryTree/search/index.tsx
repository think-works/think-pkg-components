import { Button, Input, Space, theme, Tooltip } from "antd";
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
  const { token } = theme.useToken();

  return (
    <div className={classNames(stl.search, className)}>
      <Input
        prefix={<SearchOutlined />}
        suffix={
          value && showFilter ? (
            <FilterFilled
              style={{ color: token.colorPrimary }}
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
        style={{ display: value && showFilter ? "block" : "none" }}
      >
        <Space style={{ paddingRight: 8 }}>
          <Tooltip title={current <= 0 ? "" : "上一个"}>
            <Button
              type={"default"}
              disabled={current <= 0}
              size="small"
              onClick={onLast}
              icon={<LeftOutlined />}
            />
          </Tooltip>

          <Tooltip title={total === 0 || current + 1 == total ? "" : "下一个"}>
            <Button
              disabled={total === 0 || current + 1 == total}
              size="small"
              onClick={onNext}
              icon={<RightOutlined />}
            />
          </Tooltip>
          {total > 0 && (
            <div className={stl.searchBtnText}>
              {current + 1} / {total}
            </div>
          )}
        </Space>
      </div>
    </div>
  );
};
DirectoryTreeSearch.findNextIndex = findNextIndex;
DirectoryTreeSearch.findLastIndex = findLastIndex;

export default DirectoryTreeSearch;
