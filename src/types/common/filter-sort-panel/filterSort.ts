import { FilterCategory, FilterCategoryIn, RowSelection } from '../filter/filterCustom';
import { SortOption, SortRowSelection } from '../sort/sortCustom';

export type SortRowProps = {
  row: SortRowSelection;
  index: number;
  sortOptions: SortOption[];
  selectedSortSet: Set<string>;
  handleSortSelect: (index: number, sortId: string) => void;
  handleSortDirectionSelect: (index: number, direction: string) => void;
  handleClearSortRow: (index: number) => void;
};

export type FilterRowProps = {
  row: RowSelection;
  index: number;
  filterCategories: FilterCategory[];
  selectedCategorySet: Set<string>;
  handleCategorySelect: (
    index: number,
    categoryId: string,
    numericOperator?: 'between' | '<=' | '>=' | '=' | 'in' | ''
  ) => void;
  handleOptionToggle: (index: number, optionId: string) => void;
  handleBetweenChange: (
    index: number,
    eOrValue: React.ChangeEvent<HTMLInputElement> | string | undefined,
    numericOperator: 'between' | '<=' | '>=' | '=' | 'in' | '',
    which?: 0 | 1
  ) => void;
  handleClearRow: (index: number) => void;
};

export interface InFilterProps {
  row: RowSelection;
  index: number;
  t: (key: string) => string;
  selectedCategory: FilterCategoryIn;
  handleOptionToggle: FilterRowProps['handleOptionToggle'];
  handleClearRow: FilterRowProps['handleClearRow'];
}

export interface DateRangeFilterProps {
  row: RowSelection;
  index: number;
  t: (key: string) => string;
  selectedCategoryId: string;
  handleCategorySelect: FilterRowProps['handleCategorySelect'];
  handleBetweenChange: FilterRowProps['handleBetweenChange'];
  handleClearRow: FilterRowProps['handleClearRow'];
}

export interface BetweenFilterProps {
  row: RowSelection;
  index: number;
  t: (key: string) => string;
  selectedCategory: { id: string; icon?: string };
  handleCategorySelect: FilterRowProps['handleCategorySelect'];
  handleBetweenChange: FilterRowProps['handleBetweenChange'];
  handleClearRow: FilterRowProps['handleClearRow'];
}
