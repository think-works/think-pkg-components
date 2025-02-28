import { Spin } from "antd";
import { Loading } from "@/components";

const LoadingDemo = () => {
  return (
    <div>
      描述文案无效：
      <br />
      <Spin tip="loading..." />
      <br />
      <br />
      有嵌套结构：
      <br />
      <Spin tip="loading...">
        <div
          style={{
            height: 100,
            background: "red",
          }}
        >
          123
        </div>
      </Spin>
      <br />
      <br />
      无嵌套结构：
      <br />
      <div
        style={{
          height: 100,
          background: "red",
          position: "relative",
        }}
      >
        123
        <Loading tip="loading..." />
      </div>
      <br />
      <br />
    </div>
  );
};

export default LoadingDemo;
