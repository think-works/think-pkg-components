import FilterItem from "./FilterItem";
import MinimizeFilter from "./MinimizeFilter";
import StandardFilter, { StandardFilterProps } from "./StandardFilter";

export type FilterFormProps = StandardFilterProps;

/**
 * 可筛选表单
 */
export const FilterForm = StandardFilter as typeof StandardFilter & {
  MinimizeFilter: typeof MinimizeFilter;
  FilterItem: typeof FilterItem;
};

FilterForm.MinimizeFilter = MinimizeFilter;
FilterForm.FilterItem = FilterItem;

export default FilterForm;
