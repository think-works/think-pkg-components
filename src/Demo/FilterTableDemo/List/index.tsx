import { useState } from "react";
import { LayoutQuery } from "@think/components";
import Filter from "./Filter";
import Result from "./Result";

/**
 * @param props
 * @returns
 */
const SubmissionList = () => {
  const [filter, setFilter] = useState();
  const handleFilterChange = (values: any) => {
    setFilter(values);
  };

  return (
    <LayoutQuery
      title="提测单列表"
      filter={<Filter onChange={handleFilterChange} />}
    >
      <Result filter={filter} />
    </LayoutQuery>
  );
};

export default SubmissionList;
