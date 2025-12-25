'use client';

import { ChevronDown } from 'lucide-react';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import DropdownMenuCustom from '../dropdown-menu/DropdownMenuCustom';
import { CustomButton } from '../button/CustomButton';
import { FilterRowProps } from '@/types/common/filter-sort-panel/filterSort';
import { DateRangeFilter } from './DateRangeFilter';
import { BetweenFilter } from './BetweenFilter';
import { InFilter } from './InFilter';

export function FilterRow({
  row,
  index,
  filterCategories,
  selectedCategorySet,
  handleCategorySelect,
  handleOptionToggle,
  handleBetweenChange,
  handleClearRow,
}: FilterRowProps) {
  const t = useCustomTranslation();
  const selectedCategory = filterCategories.find(c => c.id === row.categoryId);
  return (
    <div key={index} className="flex items-start gap-2 flex-wrap w-full">
      <DropdownMenuCustom
        list_menu={filterCategories.map(category => {
          const isCurrent = row.categoryId === category.id;
          const isUsedElsewhere = !isCurrent && selectedCategorySet.has(category.id);
          return {
            label: category.label,
            value: category.id,
            disabled: isCurrent || isUsedElsewhere,
          };
        })}
        triggerType="click"
        menuWidth="w-50"
        align="start"
        onSelectionChange={val => {
          if (typeof val === 'string') handleCategorySelect(index, val);
        }}
        customTrigger={
          <CustomButton
            variant="outline"
            className="w-[160px] h-10 flex items-center justify-between bg-transparent"
          >
            {row.categoryId ? selectedCategory?.label : t('Select filter')}
            <ChevronDown />
          </CustomButton>
        }
      />

      {selectedCategory && selectedCategory.operator === 'between' && (
        <BetweenFilter
          row={row}
          index={index}
          t={t}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
          handleBetweenChange={handleBetweenChange}
          handleClearRow={handleClearRow}
        />
      )}

      {selectedCategory?.operator === 'dates_range' && (
        <DateRangeFilter
          row={row}
          index={index}
          t={t}
          selectedCategoryId={selectedCategory.id}
          handleCategorySelect={handleCategorySelect}
          handleBetweenChange={handleBetweenChange}
          handleClearRow={handleClearRow}
        />
      )}

      {selectedCategory &&
        selectedCategory.operator === 'in' &&
        Array.isArray(selectedCategory.options) && (
          <InFilter
            row={row}
            index={index}
            t={t}
            selectedCategory={selectedCategory}
            handleOptionToggle={handleOptionToggle}
            handleClearRow={handleClearRow}
          />
        )}
    </div>
  );
}
