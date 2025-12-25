import { FilterCategory } from '@/types/common/filter/filterCustom';
import { SortOption } from '@/types/common/sort/sortCustom';
import { MenuItem } from '../dropdown-menu/dropdownMenu';

export interface TableActionsProps<T = unknown> {
  // Props Search
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (searchValue: string) => void;
  defaultSearchValue?: string;

  // Props Filter
  showFilter?: boolean;
  filterCategories?: FilterCategory[];
  filterCount?: number;
  onFilterChange?: (updated: FilterCategory[], count: number) => void;

  // Props Sort
  showSort?: boolean;
  sortCategories?: SortOption[];
  sortCount?: number;
  onSortChange?: (updated: SortOption[], count: number) => void;

  // Props Actions
  showActions?: boolean;
  actionOptions?: MenuItem[];
  onActionChange?: (action: string, selectedItems?: T[]) => void; // <-- generic type T
  actionPlaceholder?: string;
  actionMenuWidth?: string;
  actionAlign?: 'start' | 'center' | 'end';
  actionsDisabled?: boolean;

  // Props for Bulk Actions
  showRightBtnActions?: boolean;
  rightBtnActionsText?: string;
  rightBtnActionsClick?: () => void;
  rightBtnActionsVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  rightBtnActionsClassName?: string;
  rightBtnActionsDisabled?: boolean;
  rightBtnActionsIcon?: React.ReactNode;

  className?: string;
}

export type SortOptionArray = {
  column: string;
  direction: 'asc' | 'desc';
};

export type FilterOptionArray = {
  column: string;
  operator: string;
  value: Array<string | number | boolean>;
};
