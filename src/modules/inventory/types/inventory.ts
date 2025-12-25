// Type definitions for inventory module
export interface FilterSortPanelProps {
  panelType?: 'filter' | 'sort';
  filterCategories?: unknown[];
  sortCategories?: unknown[];
  [key: string]: unknown;
}

