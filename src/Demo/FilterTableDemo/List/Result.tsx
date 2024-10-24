import { useMemo } from "react";
import RouteTable, {
  RouteTableParams,
  RouteTableProps,
} from "@/components/RouteTable";
import { queryPageTestFeature } from "@/Demo/api/controller/feature";

export type ResultProps = {
  filter?: Record<string, any>;
};

const Result = (props: ResultProps) => {
  const { filter } = props || {};

  const workspaceId = "w00001";
  const projectId = "8f8d58";

  const fetchData = async (params: RouteTableParams) => {
    const { filter = {}, ...rest } = params;
    if (projectId && workspaceId) {
      const res = await queryPageTestFeature({
        ...rest,
        ...filter,
        workspaceId,
        projectId,
      });
      return res.data.data;
    }
    return;
  };

  const columns: RouteTableProps<any>["columns"] = useMemo(
    () => [
      {
        fixed: "left",
        width: 40,
        title: "ID",
        dataIndex: "testFeatureId",
      },
      {
        title: "名称",
        dataIndex: "name",
      },
    ],
    [],
  );

  return (
    <RouteTable
      bordered
      size="small"
      rowKey="submissionId"
      scroll={{ x: "max-content" }}
      columns={columns}
      filter={filter}
      fetchData={fetchData}
    />
  );
};

export default Result;
