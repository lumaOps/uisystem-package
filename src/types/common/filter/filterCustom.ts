export type FilterProps = {
  isOpen: boolean;
  onToggle: () => void;
  activeCount: number;
};

export type FilterOperator = 'in' | 'between' | 'dates_range';

export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}
export interface FilterAnalyticOption {
  value: string;
  label: string;
  checked: boolean;
}
export interface FilterCategoryBase {
  id: string;
  label: string;
  value: string;
  operator: FilterOperator;
  icon?: string;
}

export interface FilterCategoryIn extends FilterCategoryBase {
  operator: 'in';
  options: FilterOption[];
}

export interface FilterCategoryBetween extends FilterCategoryBase {
  operator: 'between';
  options: string | string[];
  numericOperator?: '>=' | '<=' | '=' | 'between' | 'in' | '';
}

export interface FilterCategoryRange extends FilterCategoryBase {
  operator: 'dates_range';
  options: string | string[];
  numericOperator?: '>=' | '<=' | '=' | 'between' | 'in' | '';
  inInputSelectRange?: [string, 'days' | 'months' | undefined];
}

export type FilterCategory = FilterCategoryIn | FilterCategoryBetween | FilterCategoryRange;

export interface FilterAnalytic {
  value: string;
  id: string;
  label: string;
  options: FilterAnalyticOption[];
}
export const isFilterCategoryIn = (filter: FilterCategory): filter is FilterCategoryIn =>
  filter.operator === 'in';

export const isFilterCategoryBetween = (filter: FilterCategory): filter is FilterCategoryBetween =>
  filter.operator === 'between';

export const isFilterCategoryRange = (filter: FilterCategory): filter is FilterCategoryRange =>
  filter.operator === 'dates_range';

export type RowSelection =
  | {
      categoryId: string;
      operator: 'in';
      options: string[];
    }
  | {
      categoryId: string;
      operator: 'between';
      options: string | [string, string];
      numericOperator: 'between' | '<=' | '>=' | '=' | 'in' | '';
    }
  | {
      categoryId: string;
      operator: 'dates_range';
      options: string | [string, string];
      numericOperator: 'between' | '<=' | '>=' | '=' | 'in' | '';
      inInputSelectRange?: [string, 'days' | 'months' | undefined];
    }
  | {
      categoryId: '';
      operator?: undefined;
      options?: string | [string, string];
      numericOperator?: 'between' | '<=' | '>=' | '=' | 'in' | '';
    };

export const isRowIn = (row: RowSelection): row is Extract<RowSelection, { operator: 'in' }> =>
  row.operator === 'in';

export const isRowBetween = (
  row: RowSelection
): row is Extract<RowSelection, { operator: 'between' }> => row.operator === 'between';

export const isRowRange = (
  row: RowSelection
): row is Extract<RowSelection, { operator: 'dates_range' }> => row.operator === 'dates_range';

export type NumericOperator = 'between' | '<=' | '>=' | '=' | 'in' | '';
