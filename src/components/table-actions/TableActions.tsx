'use client';

import { useState, useCallback, useMemo } from 'react';
import { type FilterCategory } from '@/types/common/filter/filterCustom';
import { type SortOption } from '@/types/common/sort/sortCustom';
import { type TableActionsProps } from '@/types/common/table-actions/tableActions';
import { sortActionOptions } from '@/utils/helpers/helperFunctions';

import SearchCustom from '../search/SearchCustom';
import ActionsCustom from '../actions/ActionsCustom';
import { CustomButton } from '../button/CustomButton';
import {
  calculateActiveFilterCount,
  calculateActiveSortCount,
  clearAllFilters,
  getActiveFilters,
  removeFilter,
  removeSort,
} from '@/utils/filters/filtersHelper';
import FilterSortPanel from './FilterSortPanel';
import ActiveFilterCustom from '../active-filtering/ActiveFilterCustom';
import FilterCustom from '../filter/FilterCustom';
import SortCustom from '../sort/SortCustom';

export default function TableActions({
  // Search
  showSearch = true,
  onSearchChange,
  defaultSearchValue = '',
  searchPlaceholder = 'Search',

  // Filter
  showFilter = true,
  filterCategories = [],
  filterCount = 0,
  onFilterChange,

  // Sort
  showSort = true,
  sortCategories = [],
  sortCount = 0,
  onSortChange,

  // Actions
  showActions = true,
  actionOptions = [],
  onActionChange,
  actionPlaceholder = 'Actions',
  actionMenuWidth = 'w-50',
  actionAlign = 'start',
  actionsDisabled = false,

  // Bulk actions
  showRightBtnActions = true,
  rightBtnActionsText = 'Bulk Actions',
  rightBtnActionsClick,
  rightBtnActionsVariant = 'outline',
  rightBtnActionsClassName = 'h-10',
  rightBtnActionsDisabled = false,
  rightBtnActionsIcon,

  // General
  className = '',
}: TableActionsProps) {
  const [openPanel, setOpenPanel] = useState<'filter' | 'sort' | null>(null);
  const activeFilters = useMemo(() => {
    if (!showFilter && !showSort) return [];
    return getActiveFilters(filterCategories || [], sortCategories || []);
  }, [filterCategories, sortCategories, showFilter, showSort]);

  const handleSearchChange = useCallback(
    (value: string) => {
      onSearchChange?.(value);
    },
    [onSearchChange]
  );

  const handleActionChange = useCallback(
    (value: string) => {
      onActionChange?.(value);
    },
    [onActionChange]
  );
  const handlerightBtnActionsClick = useCallback(() => {
    rightBtnActionsClick?.();
  }, [rightBtnActionsClick]);

  const handleFiltersChange = useCallback(
    (updated: FilterCategory[], count: number) => {
      onFilterChange?.(updated, count);
    },
    [onFilterChange]
  );

  const handleSortChange = useCallback(
    (updated: SortOption[], count: number) => {
      onSortChange?.(updated, count);
      setOpenPanel(null);
    },
    [onSortChange]
  );

  const handleClearAllFilters = useCallback(() => {
    const { clearedFilters, clearedSorts } = clearAllFilters(
      filterCategories || [],
      sortCategories || []
    );
    onFilterChange?.(clearedFilters, 0);
    onSortChange?.(clearedSorts, 0);
  }, [filterCategories, sortCategories, onFilterChange, onSortChange]);

  const handleFilterRemove = useCallback(
    (categoryId: string, optionId?: string, type: 'filter' | 'sort' = 'filter') => {
      if (type === 'sort') {
        const updated = removeSort(sortCategories || [], categoryId);
        const newSortCount = calculateActiveSortCount(updated);
        onSortChange?.(updated, newSortCount);
      } else {
        const updated = removeFilter(filterCategories || [], categoryId, optionId);
        const newCount = calculateActiveFilterCount(updated);
        onFilterChange?.(updated, newCount);
      }
    },
    [filterCategories, sortCategories, onFilterChange, onSortChange]
  );
  return (
    <div className={`flex flex-col space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap sm:flex-row gap-3 sm:gap-4">
          {showSearch && (
            <SearchCustom
              onSearchChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="w-full sm:w-auto"
              defaultSearchValue={defaultSearchValue}
            />
          )}

          <div className="flex sm:flex-row gap-3 sm:gap-4 flex-wrap w-full sm:w-auto">
            {showFilter && (
              <FilterCustom
                isOpen={openPanel === 'filter'}
                onToggle={() => setOpenPanel(openPanel === 'filter' ? null : 'filter')}
                activeCount={filterCount}
              />
            )}
            {showSort && (
              <SortCustom
                isOpen={openPanel === 'sort'}
                onToggle={() => setOpenPanel(openPanel === 'sort' ? null : 'sort')}
                activeCount={sortCount}
              />
            )}
            {showActions && (
              <ActionsCustom
                actionOptions={sortActionOptions(actionOptions)}
                onActionChange={handleActionChange}
                buttonText={actionPlaceholder}
                menuWidth={actionMenuWidth}
                align={actionAlign}
                isDisabled={actionsDisabled}
              />
            )}
          </div>
        </div>

        {showRightBtnActions && (
          <div className="w-full sm:w-auto sm:ml-auto">
            <CustomButton
              variant={rightBtnActionsVariant}
              className={rightBtnActionsClassName}
              onClick={handlerightBtnActionsClick}
              disabled={rightBtnActionsDisabled}
            >
              {rightBtnActionsIcon && <span>{rightBtnActionsIcon}</span>}
              {rightBtnActionsText}
            </CustomButton>
          </div>
        )}
      </div>

      {openPanel === 'filter' && (
        <FilterSortPanel
          panelType="filter"
          filterCategories={filterCategories || []}
          onFilterApply={handleFiltersChange}
          onCancel={() => setOpenPanel(null)}
        />
      )}

      {openPanel === 'sort' && (
        <FilterSortPanel
          panelType="sort"
          sortOptions={sortCategories || []}
          onSortApply={handleSortChange}
          onCancel={() => setOpenPanel(null)}
        />
      )}

      {!openPanel && activeFilters.length > 0 && (
        <ActiveFilterCustom
          activeFilters={activeFilters}
          onClearAll={handleClearAllFilters}
          onFilterRemove={handleFilterRemove}
        />
      )}
    </div>
  );
}
