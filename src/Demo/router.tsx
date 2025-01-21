import { createBrowserRouter, RouteObject } from "react-router-dom";
import AvatarDemo from "./AvatarDemo";
import ButtonDemo from "./ButtonDemo";
import BypassPropsDemo from "./BypassPropsDemo";
import DragContainerDemo from "./DragContainerDemo";
import EditableTableDemo from "./EditableTableDemo";
import FilterFormDemo from "./FilterFormDemo";
import FilterTableDemo from "./FilterTableDemo";
import FlexTabsDemo from "./FlexTabsDemo";
import Home from "./Home";
import PageLayoutDemo from "./PageLayoutDemo";
import RouterTableDemo from "./RouterTableDemo";
import SortableContainerDemo from "./SortableContainerDemo";
import SortableTableDemo from "./SortableTableDemo";
import TreeDemo from "./TreeDemo";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/button",
    element: <ButtonDemo />,
  },
  {
    path: "/avatar",
    element: <AvatarDemo />,
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
    element: <PageLayoutDemo />,
    handle: { name: "page-layout", title: "页面布局", sider: true },
  },
  {
    path: "/filter-table",
    element: <FilterTableDemo />,
  },
  {
    path: "/router-table",
    element: <RouterTableDemo />,
  },
  {
    path: "/sortable-container",
    element: <SortableContainerDemo />,
  },
  {
    path: "/sortable-table",
    element: <SortableTableDemo />,
  },
  {
    path: "/bypass-props",
    element: <BypassPropsDemo />,
  },
];

export const router = createBrowserRouter(routes);
