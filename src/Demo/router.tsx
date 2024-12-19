import { createBrowserRouter, RouteObject } from "react-router-dom";
import DragContainerDemo from "./DragContainerDemo";
import EditableTableDemo from "./EditableTableDemo";
import FilterFormDemo from "./FilterFormDemo";
import FilterTable from "./FilterTableDemo";
import FlexTabsDemo from "./FlexTabsDemo";
import Home from "./Home";
import PageLayout from "./PageLayout";
import RouterTable from "./RouterTableDemo";
import SortableContainerDemo from "./SortableContainerDemo";
import SortableTableDemo from "./SortableTableDemo";
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
  {
    path: "/filter-form",
    element: <FilterFormDemo />,
  },
  {
    path: "/page-layout",
    element: <PageLayout />,
    handle: { name: "page-layout", title: "页面布局", sider: true },
  },
  {
    path: "/filter-table",
    element: <FilterTable />,
  },
  {
    path: "/router-table",
    element: <RouterTable />,
  },
  {
    path: "/sortable-container",
    element: <SortableContainerDemo />,
  },
  {
    path: "/sortable-table",
    element: <SortableTableDemo />,
  },
];

export const router = createBrowserRouter(routes);
