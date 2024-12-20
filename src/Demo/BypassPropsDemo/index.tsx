/* eslint-disable no-console */
import { Form, Input, Tooltip } from "antd";
import { BypassProps } from "@/components";

const BypassPropsDemo = () => {
  return (
    <Form onValuesChange={(...rest) => console.log(...rest)}>
      <Form.Item label="无法绑定表单" name="failed">
        <Tooltip title="无法绑定表单" placement="bottomLeft">
          <Input />
        </Tooltip>
      </Form.Item>
      <Form.Item label="可以绑定表单" name="success">
        <BypassProps
          bypass={({ children }) => (
            <Tooltip title="可以绑定表单" placement="bottomLeft">
              {children}
            </Tooltip>
          )}
        >
          <Input />
        </BypassProps>
      </Form.Item>
    </Form>
  );
};

export default BypassPropsDemo;
