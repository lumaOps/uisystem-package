'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { CustomButton } from '../button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

import {
  NumericOperator,
  RowSelection,
  isFilterCategoryBetween,
  isFilterCategoryIn,
  isFilterCategoryRange,
} from '@/types/common/filter/filterCustom';
import { CompleteSortRowSelection, SortRowSelection } from '@/types/common/sort/sortCustom';
import { FilterSortPanelProps } from '@/modules/inventory/types/inventory';
import { FilterRow } from './FilterRow';
import { SortRow } from './SortRow';
import {
  addFilterRow,
  addSortRow,
  applyFilterSelections,
  canAddRowValue,
  FilterApplyDisabled,
  onApplySort,
  selectCategory,
  updateBetweenOrRangeRow,
} from '@/utils/filters/filtersHelper';
import { CardCustom } from '../card/CardCustom';

const blankFilterRow = (): RowSelection => ({ categoryId: '' });
const blankSortRow = (): SortRowSelection => ({ sortId: '' });

export default function FilterSortPanel({
  panelType,
  filterCategories = [],
  onFilterApply,
  sortOptions = [],
  onSortApply,
  onCancel,
}: FilterSortPanelProps) {
  const t = useCustomTranslation();

  const [filterSelections, setFilterSelections] = useState<RowSelection[]>([blankFilterRow()]);
  const initialSelectionsRef = useRef<RowSelection[]>([blankFilterRow()]);

  const [localSortSelections, setLocalSortSelections] = useState<SortRowSelection[]>([
    blankSortRow(),
  ]);
  const initialSortSelectionsRef = useRef<SortRowSelection[]>([blankSortRow()]);

  /* --------- Initialize Filters --------- */
  useEffect(() => {
    if (panelType !== 'filter') return;

    const rows: RowSelection[] = [];
    filterCategories.forEach(cat => {
      if (isFilterCategoryIn(cat)) {
        const selected = (cat.options ?? []).filter(o => o.checked).map(o => o.id);
        if (selected.length) {
          rows.push({ categoryId: cat.id, operator: 'in', options: selected });
        }
      } else if (isFilterCategoryBetween(cat)) {
        const numericOperator = cat.numericOperator ?? 'between';
        const options = cat.options;

        if (typeof options === 'string') {
          if (options !== '') {
            rows.push({
              categoryId: cat.id,
              operator: 'between',
              numericOperator,
              options,
            });
          }
        } else if (Array.isArray(options)) {
          const [min, max] = options;
          if (min && max) {
            rows.push({
              categoryId: cat.id,
              operator: 'between',
              numericOperator,
              options: [min, max],
            });
          }
        }
      } else if (isFilterCategoryRange(cat)) {
        const numericOperator = cat.numericOperator ?? 'between';
        const options = cat.options;

        if (numericOperator === 'between' || numericOperator === 'in') {
          const [start, end] = Array.isArray(options) ? options : ['', ''];
          if (start || end) {
            rows.push({
              categoryId: cat.id,
              operator: 'dates_range',
              numericOperator,
              options: [start, end],
              inInputSelectRange: cat.inInputSelectRange,
            });
          }
        } else {
          const value = Array.isArray(options) ? options[0] : options;
          if (value) {
            rows.push({
              categoryId: cat.id,
              operator: 'dates_range',
              numericOperator,
              options: value,
            });
          }
        }
      }
    });

    const result = rows.length ? rows : [blankFilterRow()];
    initialSelectionsRef.current = result;
    setFilterSelections(result);
  }, [filterCategories, panelType]);

  /* --------- Initialize Sorts --------- */
  useEffect(() => {
    if (panelType !== 'sort') return;

    const preSelectedRaw = sortOptions.map(option => {
      const checkedDirection = option.options?.find(o => o.checked);
      return checkedDirection ? { sortId: option.value, direction: checkedDirection.value } : null;
    });

    const preSelected = preSelectedRaw.filter(
      (item): item is CompleteSortRowSelection => item !== null
    ) as SortRowSelection[];

    const initialSorts = preSelected.length > 0 ? preSelected : [blankSortRow()];
    initialSortSelectionsRef.current = initialSorts;
    setLocalSortSelections(initialSorts);
  }, [sortOptions, panelType]);

  const handleAddRow = () => {
    if (panelType === 'filter') {
      setFilterSelections(prev => addFilterRow(prev, filterCategories.length, blankFilterRow));
    } else {
      setLocalSortSelections(prev => addSortRow(prev, sortOptions.length, blankSortRow));
    }
  };

  const handleCategorySelect = useCallback(
    (index: number, categoryId: string, numericOperator?: NumericOperator) => {
      setFilterSelections(prev =>
        selectCategory(prev, index, categoryId, filterCategories, numericOperator)
      );
    },
    [filterCategories]
  );

  const handleOptionToggle = useCallback((index: number, optionId: string) => {
    setFilterSelections(prev => {
      const next = [...prev];
      const row = next[index];
      if (!row || row.operator !== 'in') return next;

      const exists = row.options.includes(optionId);
      next[index] = {
        ...row,
        options: exists ? row.options.filter(id => id !== optionId) : [...row.options, optionId],
      };
      return next;
    });
  }, []);

  const handleBetweenChange = (
    index: number,
    eOrValue: React.ChangeEvent<HTMLInputElement> | string | undefined,
    numericOperator: NumericOperator,
    which?: 0 | 1
  ) => {
    setFilterSelections(prev =>
      updateBetweenOrRangeRow(prev, index, eOrValue, numericOperator, which)
    );
  };

  function handleClearRowGeneric<T>(
    index: number,
    setState: React.Dispatch<React.SetStateAction<T[]>>,
    getBlankRow: () => T
  ) {
    setState(prev => {
      if (prev.length === 1) return [getBlankRow()];
      return prev.filter((_, i) => i !== index);
    });
  }
  const handleClearRow = useCallback(handleClearRowGeneric, []);

  const handleSortSelect = useCallback(
    (index: number, sortId: string) => {
      setLocalSortSelections(prev => {
        const next = [...prev];
        const sortOption = sortOptions.find(s => s.value === sortId);
        next[index] = {
          sortId,
          direction: sortOption?.options?.[0]?.value || 'asc',
        };
        return next;
      });
    },
    [sortOptions]
  );

  const handleSortDirectionSelect = useCallback((index: number, direction: string) => {
    setLocalSortSelections(prev => {
      const next = [...prev];
      if (next[index].sortId) {
        next[index] = { ...next[index], direction };
      }
      return next;
    });
  }, []);

  const selectedCategorySet = useMemo(() => {
    return new Set(filterSelections.map(sel => sel.categoryId));
  }, [filterSelections]);

  const selectedSortSet = useMemo(() => {
    return new Set(localSortSelections.map(sel => sel.sortId));
  }, [localSortSelections]);

  const isFilterApplyDisabled = useMemo(() => {
    return FilterApplyDisabled(filterSelections);
  }, [filterSelections]);

  const isSortApplyDisabled = useMemo(() => {
    if (!localSortSelections.length) return true;
    return localSortSelections.some(row => {
      if (!row.sortId) return false;
      return !row.direction;
    });
  }, [localSortSelections]);

  const canAddRow = useMemo(
    () =>
      canAddRowValue(
        panelType,
        filterSelections,
        localSortSelections,
        selectedCategorySet,
        selectedSortSet,
        filterCategories.length,
        sortOptions.length
      ),
    [
      panelType,
      filterSelections,
      localSortSelections,
      selectedCategorySet,
      selectedSortSet,
      filterCategories.length,
      sortOptions.length,
    ]
  );

  const handleApplyFilters = useCallback(() => {
    const { updatedCategories, count } = applyFilterSelections(filterSelections, filterCategories);
    onFilterApply?.(updatedCategories, count);
    onCancel();
  }, [filterSelections, filterCategories, onFilterApply, onCancel]);

  const handleApplySort = useCallback(() => {
    onApplySort(localSortSelections, sortOptions, onSortApply, onCancel);
  }, [localSortSelections, sortOptions, onSortApply, onCancel]);

  const handlePanelCancel = useCallback(() => {
    if (panelType === 'filter') {
      setFilterSelections(initialSelectionsRef.current);
    } else {
      setLocalSortSelections(initialSortSelectionsRef.current);
    }
    onCancel();
  }, [panelType, onCancel]);

  const isApplyDisabled = panelType === 'filter' ? isFilterApplyDisabled : isSortApplyDisabled;
  const handleApply = panelType === 'filter' ? handleApplyFilters : handleApplySort;
  return (
    <CardCustom
      containerClassName="shadow-md border"
      contentClassName="p-4 flex flex-col gap-4"
      footer={
        <div className="flex justify-end gap-2 pt-4 mt-4">
          <CustomButton variant="outline" onClick={handlePanelCancel}>
            {t('Cancel')}
          </CustomButton>
          <CustomButton onClick={handleApply} disabled={isApplyDisabled}>
            {t('Apply')}
          </CustomButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <label className="text-base font-semibold">
          {panelType === 'filter' ? t('Filters') : t('Sort')}:
        </label>

        {panelType === 'filter' &&
          filterSelections.map((row, index) => (
            <FilterRow
              key={index}
              row={row}
              index={index}
              filterCategories={filterCategories}
              selectedCategorySet={selectedCategorySet}
              handleCategorySelect={handleCategorySelect}
              handleOptionToggle={handleOptionToggle}
              handleBetweenChange={handleBetweenChange}
              handleClearRow={() => handleClearRow(index, setFilterSelections, blankFilterRow)}
            />
          ))}

        {panelType === 'sort' &&
          localSortSelections.map((row, index) => (
            <SortRow
              key={index}
              row={row}
              index={index}
              sortOptions={sortOptions}
              selectedSortSet={selectedSortSet}
              handleSortSelect={handleSortSelect}
              handleSortDirectionSelect={handleSortDirectionSelect}
              handleClearSortRow={() => handleClearRow(index, setLocalSortSelections, blankSortRow)}
            />
          ))}

        <div className="flex gap-2">
          <CustomButton
            variant="outline"
            className="w-fit bg-transparent"
            onClick={handleAddRow}
            disabled={!canAddRow}
          >
            {t('+ Filter')}
          </CustomButton>
        </div>
      </div>
    </CardCustom>
  );
}
