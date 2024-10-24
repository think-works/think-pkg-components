import { Form, Input } from "antd";
import { FilterForm } from "@/components/FilterForm";

export type FilterProps = {
  action?: React.ReactNode;
  onChange?: (params: Record<string, any>) => void;
};

const Filter = (props: FilterProps) => {
  const { action, onChange } = props || {};

  return (
    <FilterForm
      action={action}
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
