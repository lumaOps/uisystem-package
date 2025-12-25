// Filter helper functions - stubs
import type { FilterCategory } from '@/types/common/filter/filterCustom';
import type { SortOption } from '@/types/common/sort/sortCustom';

export function calculateActiveFilterCount(filters: unknown[]): number {
  return filters?.length || 0;
}

export function calculateActiveSortCount(sorts: unknown[]): number {
  return sorts?.length || 0;
}

export function clearAllFilters(): unknown[] {
  return [];
}

export function getActiveFilters(filters: unknown[]): unknown[] {
  return filters || [];
}

export function removeFilter(filters: unknown[], index: number): unknown[] {
  return filters.filter((_, i) => i !== index);
}

export function removeSort(sorts: unknown[], index: number): unknown[] {
  return sorts.filter((_, i) => i !== index);
}

export function addFilterRow(rows: unknown[]): unknown[] {
  return [...rows, {}];
}

export function addSortRow(rows: unknown[]): unknown[] {
  return [...rows, {}];
}

export function applyFilterSelections(
  selections: unknown[],
  categories: FilterCategory[]
): unknown[] {
  return selections || [];
}

export function canAddRowValue(): boolean {
  return true;
}

export function FilterApplyDisabled(): boolean {
  return false;
}

export function onApplySort(sorts: unknown[]): unknown[] {
  return sorts || [];
}

export function selectCategory(categoryId: string, categories: FilterCategory[]): FilterCategory | null {
  return categories.find(c => c.id === categoryId) || null;
}

export function updateBetweenOrRangeRow(
  rows: unknown[],
  index: number,
  updates: unknown
): unknown[] {
  const newRows = [...rows];
  newRows[index] = { ...newRows[index], ...updates };
  return newRows;
}

