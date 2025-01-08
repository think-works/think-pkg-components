/* eslint-disable no-console */
import { Button, Form, Input, Select, Space, Tooltip } from "antd";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BaseDatePicker, BaseDateRangePicker, FilterForm } from "@/components";

const { MinimizeFilter, FilterItem } = FilterForm;

const FilterFormDemo = () => {
  const [_searchParams, setSearchParams] = useSearchParams();
  const [_filter, setFilter] = useState<Record<string, any>>();

  const handleInitValues = useCallback((values?: Record<string, any>) => {
    console.log("handleInitValues", values);
  }, []);

  const handleFilterChange = useCallback((values: Record<string, any>) => {
    setFilter(values);
    console.log("handleFilterChange", values);
  }, []);

  const handleQuery = useCallback(() => {
    const filter = {
      Keyword: "Keyword",
      Type: 1,

      Input: "Input",
      Select: 1,
      Single: 1,
      Multiple: [1, 2],
      DatePicker: Date.now(),
      DatePickerTime: Date.now(),
      RangePicker: [Date.now(), Date.now() + 1000 * 60 * 60 * 24],
      RangePickerTime: [Date.now(), Date.now() + 1000 * 60 * 60 * 24],
    };

    setSearchParams({
      filter: JSON.stringify(filter),
    });
    window.location.reload();
  }, [setSearchParams]);

  const getItems = (
    Item: React.ElementType = Form.Item,
    params?: Record<string, any>,
  ) => {
    const items = [
      <Item key="Input" name="Input" label="Input" {...params}>
        <Input allowClear />
      </Item>,
      <Item key="Select" name="Select" label="Select" {...params}>
        <Select
          allowClear
          options={[
            {
              value: 1,
              label:
                "选项一选项一选项一选项一选项一选项一选项一选项一选项一选项一选项一选项一",
            },
            { value: 2, label: "选项二" },
          ]}
        />
      </Item>,
      <Item key="Single" name="Single" label="Single" {...params}>
        <Select
          allowClear
          options={[
            { value: 1, label: "选项一" },
            { value: 2, label: "选项二" },
          ]}
        />
      </Item>,
      <Item key="Multiple" name="Multiple" label="Multiple" {...params}>
        <Select
          allowClear
          mode="multiple"
          options={[
            { value: 1, label: "选项一" },
            { value: 2, label: "选项二" },
            { value: 3, label: "选项三" },
          ]}
        />
      </Item>,
      <Item key="DatePicker" name="DatePicker" label="DatePicker" {...params}>
        <BaseDatePicker allowClear />
      </Item>,
      <Item
        key="DatePickerTime"
        name="DatePickerTime"
        label="DatePickerTime"
        {...params}
      >
        <BaseDatePicker allowClear showTime />
      </Item>,
      <Item
        key="RangePicker"
        name="RangePicker"
        label="RangePicker"
        {...params}
      >
        <BaseDateRangePicker allowClear />
      </Item>,
    ];

    return items;
  };

  const getRangePickerTime = (
    Item: React.ElementType = Form.Item,
    params?: Record<string, any>,
  ) => {
    const item = (
      <Item
        key="RangePickerTime"
        name="RangePickerTime"
        label={
          <Tooltip title="超长截断和文字提示，需业务方自行处理。">
            <div
              style={{
                maxWidth: 70,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              RangePickerTime
            </div>
          </Tooltip>
        }
        {...params}
      >
        <BaseDateRangePicker allowClear showTime />
      </Item>
    );

    return item;
  };

  return (
    <div
      style={{ height: "100%", backgroundColor: "#fff", overflow: "hidden" }}
    >
      <h3>标准表单项</h3>
      <Space wrap>
        {[...getItems(FilterItem), getRangePickerTime(FilterItem)]}
      </Space>
      <h3>定制表单项</h3>
      <Space wrap>
        {[
          ...getItems(FilterItem, { outlined: true }),
          getRangePickerTime(FilterItem, { outlined: true }),
        ]}
      </Space>
      <h3>标准筛选表单</h3>
      <FilterForm
        // outlinedItem
        onInitValues={handleInitValues}
        onFilterChange={handleFilterChange}
        items={[...getItems(), getRangePickerTime()]}
      />
      <h3>最小化筛选表单</h3>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={handleQuery}>验证表单初始化</Button>
        <MinimizeFilter
          // filterChangeDebounce={-1}
          onInitValues={handleInitValues}
          onFilterChange={handleFilterChange}
          moreFilterItems={[
            ...getItems(),
            {
              children: getRangePickerTime(),
              colProps: {
                span: 16,
              },
            },
          ]}
          items={[
            <Form.Item key="Keyword" name="Keyword">
              <Input allowClear placeholder="Keyword" />
            </Form.Item>,
            <Form.Item key="Type" name="Type">
              <Select
                allowClear
                placeholder="Type"
                options={[
                  { value: 1, label: "选项一" },
                  { value: 2, label: "选项二" },
                ]}
              />
            </Form.Item>,
          ]}
        />
      </div>
    </div>
  );
};

export default FilterFormDemo;
