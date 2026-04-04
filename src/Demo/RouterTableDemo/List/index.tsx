import { useState } from "react";
import { LayoutQuery, RouteTable } from "@/components";
import Filter from "./Filter";
import Result from "./Result";

/**
 * @param props
 * @returns
 */
const SubmissionList = () => {
  const queryFilter = RouteTable.useSearchFilterValue();

  const [filter, setFilter] = useState(queryFilter);

  const handleFilterChange = (values: any) => {
    setFilter(values);
  };

  return (
    <LayoutQuery
      title="提测单列表"
      filter={
        <Filter defaultValues={queryFilter} onChange={handleFilterChange} />
      }
    >
      <Result filter={filter} />
    </LayoutQuery>
  );
};

export default SubmissionList;
