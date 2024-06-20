import { createBrowserRouter, RouteObject } from "react-router-dom";
import DragContainerDemo from "./DragContainerDemo";
import EditableTableDemo from "./EditableTableDemo";
import FlexTabsDemo from "./FlexTabsDemo";
import Home from "./Home";
import TreeDemo from "./TreeDemo";

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
  {
    path: "/flex-tabs",
    element: <FlexTabsDemo />,
  },
  {
    path: "/tree",
    element: <TreeDemo />,
  },
];

export const router = createBrowserRouter(routes);
