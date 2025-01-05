/* eslint-disable no-console */
import { DatePicker, Input, Select } from "antd";
import { useCallback } from "react";
import { FilterForm, FilterFormProps } from "@/components";

const { RangePicker } = DatePicker;
const { MinimizeFilter, FilterItem } = FilterForm;

const FilterFormDemo = () => {
  const handleInitValues = useCallback((values?: Record<string, any>) => {
    console.log("handleInitValues", values);
  }, []);
  const handleFilterChange = useCallback((values: Record<string, any>) => {
    console.log("handleFilterChange", values);
  }, []);

  const getItems = (customStyle?: boolean): FilterFormProps["items"] => [
    <FilterItem
      customStyle={customStyle}
      key="Input"
      name="Input"
      label="Input"
    >
      <Input allowClear />
    </FilterItem>,
    <FilterItem
      customStyle={customStyle}
      key="Select"
      name="Select"
      label="Select"
    >
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
    </FilterItem>,
    <FilterItem
      customStyle={customStyle}
      key="Single"
      name="Single"
      label="Single"
    >
      <Select
        allowClear
        options={[
          { value: 1, label: "选项一" },
          { value: 2, label: "选项二" },
        ]}
      />
    </FilterItem>,
    <FilterItem
      customStyle={customStyle}
      key="Multiple"
      name="Multiple"
      label="Multiple"
    >
      <Select
        allowClear
        mode="multiple"
        options={[
          { value: 1, label: "选项一" },
          { value: 2, label: "选项二" },
        ]}
      />
    </FilterItem>,
    <FilterItem
      customStyle={customStyle}
      key="DatePicker"
      name="DatePicker"
      label="DatePicker"
    >
      <DatePicker allowClear />
    </FilterItem>,
    <FilterItem
      customStyle={customStyle}
      key="DatePickerTime"
      name="DatePickerTime"
      label="DatePickerTime"
    >
      <DatePicker allowClear showTime />
    </FilterItem>,
    <FilterItem
      customStyle={customStyle}
      key="RangePicker"
      name="RangePicker"
      label="RangePicker"
    >
      <RangePicker allowClear />
    </FilterItem>,
    {
      colProps: customStyle
        ? {
            span: 24,
          }
        : undefined,
      children: (
        <FilterItem
          customStyle={customStyle}
          key="RangePickerTime"
          name="RangePickerTime"
          label="RangePickerTime"
        >
          <RangePicker allowClear showTime />
        </FilterItem>
      ),
    },
  ];

  return (
    <div style={{ height: "100%", backgroundColor: "#fff" }}>
      <FilterForm
        items={getItems(false)}
        onInitValues={handleInitValues}
        onFilterChange={handleFilterChange}
      />
      <hr />
      <MinimizeFilter
        moreFilterItems={getItems()}
        onInitValues={handleInitValues}
        onFilterChange={handleFilterChange}
        items={[
          <FilterItem key="Keyword" name="Keyword" label="Keyword">
            <Input allowClear placeholder="Keyword" />
          </FilterItem>,
          <FilterItem key="Type" name="Type" label="Type">
            <Select
              allowClear
              placeholder="Type"
              options={[
                { value: 1, label: "选项一" },
                { value: 2, label: "选项二" },
              ]}
            />
          </FilterItem>,
        ]}
      />
    </div>
  );
};

export default FilterFormDemo;
