import { Form, Input } from "antd";
import { FilterForm } from "@/components/FilterForm";
import { SelectWithAddonBefore } from "@/components/SelectWithAddonBefore";

export type FilterProps = {
  onChange?: (params: Record<string, any>) => void;
};

const Filter = (props: FilterProps) => {
  const { onChange } = props || {};

  return (
    <FilterForm
      onFilterChange={onChange}
      items={[
        <Form.Item key="featureIdPattern" name="featureIdPattern" label="ID">
          <Input />
        </Form.Item>,
        <Form.Item
          key="featureNamePattern"
          name="featureNamePattern"
          label="名称"
        >
          <Input />
        </Form.Item>,
        <Form.Item key="id" name="id" label="名称">
          <SelectWithAddonBefore width={200} addonBefore="前置文本" />
        </Form.Item>,
      ]}
    />
  );
};

export default Filter;
