import "@ant-design/v5-patch-for-react-19";
import ReactDOM from "react-dom/client";
import App from "./Demo";

const app = document.querySelector("#app")!;
ReactDOM.createRoot(app).render(<App />);
