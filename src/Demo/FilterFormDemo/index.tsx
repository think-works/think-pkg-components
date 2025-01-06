/* eslint-disable no-console */
import { DatePicker, Form, Input, Select, Space, Tooltip } from "antd";
import { useCallback } from "react";
import { FilterForm } from "@/components";

const { RangePicker } = DatePicker;
const { MinimizeFilter, FilterItem } = FilterForm;

const FilterFormDemo = () => {
  const handleInitValues = useCallback((values?: Record<string, any>) => {
    console.log("handleInitValues", values);
  }, []);
  const handleFilterChange = useCallback((values: Record<string, any>) => {
    console.log("handleFilterChange", values);
  }, []);

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
        <DatePicker allowClear />
      </Item>,
      <Item
        key="DatePickerTime"
        name="DatePickerTime"
        label="DatePickerTime"
        {...params}
      >
        <DatePicker allowClear showTime />
      </Item>,
      <Item
        key="RangePicker"
        name="RangePicker"
        label="RangePicker"
        {...params}
      >
        <RangePicker allowClear />
      </Item>,
      <Item
        key="RangePickerTime"
        name="RangePickerTime"
        label={
          <Tooltip title="超长截断和文字提示，需业务方自行处理。">
            <div
              style={{
                maxWidth: 80,
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
        <RangePicker allowClear showTime />
      </Item>,
    ];

    return items;
  };

  return (
    <div
      style={{ height: "100%", backgroundColor: "#fff", overflow: "hidden" }}
    >
      <h3>标准表单项</h3>
      <Space wrap>{getItems(FilterItem)}</Space>
      <h3>定制表单项</h3>
      <Space wrap>{getItems(FilterItem, { outlined: true })}</Space>
      <h3>标准筛选表单</h3>
      <FilterForm
        outlinedItem
        items={getItems()}
        onInitValues={handleInitValues}
        onFilterChange={handleFilterChange}
      />
      <h3>最小化筛选表单</h3>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <MinimizeFilter
          outlinedItem
          moreFilterItems={getItems()}
          onInitValues={handleInitValues}
          onFilterChange={handleFilterChange}
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
