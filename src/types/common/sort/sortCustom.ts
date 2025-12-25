export interface SortOption {
  label: string;
  value: string;
  direction: string;
  options: {
    label: string;
    value: string;
    checked: boolean;
  }[];
}

export interface SortOptionsData {
  count: number;
  items: SortOption[];
}

export type SortProps = {
  isOpen: boolean;
  onToggle: () => void;
  activeCount: number;
};

export type SortRowSelection =
  | {
      sortId: string;
      direction: string;
    }
  | {
      sortId: '';
      direction?: string;
    };

export const isSortRowComplete = (
  row: SortRowSelection
): row is Extract<SortRowSelection, { sortId: string; direction: string }> =>
  row.sortId !== '' && !!row.direction;

export type CompleteSortRowSelection = {
  sortId: string;
  direction: string;
};
