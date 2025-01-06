import FilterItem, { FilterItemProps } from "./FilterItem";
import MinimizeFilter, { MinimizeFilterProps } from "./MinimizeFilter";
import StandardFilter, { StandardFilterProps } from "./StandardFilter";

export type FilterFormProps = StandardFilterProps;
export type FilterFormMinimizeProps = MinimizeFilterProps;
export type FilterFormItemProps = FilterItemProps;

/**
 * 可筛选表单
 */
export const FilterForm = StandardFilter as typeof StandardFilter & {
  /** 最小化可筛选表单 */
  MinimizeFilter: typeof MinimizeFilter;
  /** 定制筛选项 */
  FilterItem: typeof FilterItem;
};

FilterForm.MinimizeFilter = MinimizeFilter;
FilterForm.FilterItem = FilterItem;

export default FilterForm;
