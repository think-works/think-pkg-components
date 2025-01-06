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

  const getItems = (standard?: boolean): FilterFormProps["items"] => [
    <FilterItem standard={standard} key="Input" name="Input" label="Input">
      <Input allowClear />
    </FilterItem>,
    <FilterItem standard={standard} key="Select" name="Select" label="Select">
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
    <FilterItem standard={standard} key="Single" name="Single" label="Single">
      <Select
        allowClear
        options={[
          { value: 1, label: "选项一" },
          { value: 2, label: "选项二" },
        ]}
      />
    </FilterItem>,
    <FilterItem
      standard={standard}
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
      standard={standard}
      key="DatePicker"
      name="DatePicker"
      label="DatePicker"
    >
      <DatePicker allowClear />
    </FilterItem>,
    <FilterItem
      standard={standard}
      key="DatePickerTime"
      name="DatePickerTime"
      label="DatePickerTime"
    >
      <DatePicker allowClear showTime />
    </FilterItem>,
    <FilterItem
      standard={standard}
      key="RangePicker"
      name="RangePicker"
      label="RangePicker"
    >
      <RangePicker allowClear />
    </FilterItem>,
    {
      colProps: standard
        ? {
            span: 24,
          }
        : undefined,
      children: (
        <FilterItem
          standard={standard}
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
        items={getItems(true)}
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
