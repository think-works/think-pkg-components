import { Form, Input } from "antd";
import { FilterForm } from "@/components";

export type FilterProps = {
  defaultValues?: Record<string, any>;
  onChange?: (params: Record<string, any>) => void;
};

const Filter = (props: FilterProps) => {
  const { defaultValues, onChange } = props || {};

  return (
    <FilterForm
      initialValues={defaultValues}
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
      ]}
    />
  );
};

export default Filter;
