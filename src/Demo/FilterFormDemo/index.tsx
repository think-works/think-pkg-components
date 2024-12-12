import { Form, Input, Select } from "antd";
import { FilterForm } from "@/components";

const defectPriority = [
  {
    key: "p1",
    value: 1,
    label: "P1",
  },
  {
    key: "p2",
    value: 2,
    label: "P2",
  },
  {
    key: "p3",
    value: 3,
    label: "P3",
  },
  {
    key: "p4",
    value: 4,
    label: "P4",
  },
];

const defectSeverity = [
  {
    key: "fatal",
    value: "FATAL",
    label: "致命",
  },
  {
    key: "critical",
    value: "CRITICAL",
    label: "严重",
  },
  {
    key: "major",
    value: "MAJOR",
    label: "一般",
  },
  {
    key: "minor",
    value: "MINOR",
    label: "轻微",
  },
];

const FlexTabsDemo = () => {
  const handleFilterChange = (params: Record<string, any>) => {
    // eslint-disable-next-line no-console
    console.log(params);
  };

  return (
    <FilterForm
      onFilterChange={handleFilterChange}
      items={[
        <Form.Item key="defectIdPattern" name="defectIdPattern" label="ID">
          <Input allowClear />
        </Form.Item>,
        <Form.Item
          key="defectNamePattern"
          name="defectNamePattern"
          label="名称"
        >
          <Input allowClear />
        </Form.Item>,
        <Form.Item key="priority" name="priority" label="优先级">
          <Select allowClear options={defectPriority} />
        </Form.Item>,
        <Form.Item key="severity" name="severity" label="严重程度">
          <Select allowClear options={defectSeverity} />
        </Form.Item>,
      ]}
    />
  );
};

export default FlexTabsDemo;
