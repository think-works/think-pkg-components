import { createBrowserRouter, RouteObject } from "react-router-dom";
import DragContainerDemo from "./DragContainerDemo";
import EditableTableDemo from "./EditableTableDemo";
import Home from "./Home";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/drag-container",
    element: <DragContainerDemo />,
  },
  {
    path: "/editable-table",
    element: <EditableTableDemo />,
  },
];

export const router = createBrowserRouter(routes);
