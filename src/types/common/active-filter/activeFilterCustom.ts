export interface ActiveFiltersComponentGlobalProps {
  activeFilters: ActiveFilter[];
  onFilterRemove?: (categoryId: string, optionId?: string, type?: 'filter' | 'sort') => void;
  onClearAll: () => void;
  className?: string;
}

export type ActiveFilter =
  | {
      type: 'filter';
      categoryId: string;
      categoryLabel: string;
      optionId: string;
      operator: 'in';
      optionLabel: string;
    }
  | {
      type: 'filter';
      categoryId: string;
      categoryLabel: string;
      operator: 'between';
      numericOperator: string | undefined;
      options: string | [string, string];
    }
  | {
      type: 'filter';
      categoryId: string;
      categoryLabel: string;
      operator: 'dates_range';
      numericOperator: string | undefined;
      options: string | [string, string];
    }
  | {
      type: 'sort';
      categoryId: string;
      categoryLabel: string;
      sortDirection: string;
    };
