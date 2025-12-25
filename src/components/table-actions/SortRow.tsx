'use client';

import { ChevronDown, Trash2 } from 'lucide-react';
import DropdownMenuCustom from '../dropdown-menu/DropdownMenuCustom';
import { CustomButton } from '../button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { SortRowProps } from '@/types/common/filter-sort-panel/filterSort';

export function SortRow({
  row,
  index,
  sortOptions,
  selectedSortSet,
  handleSortSelect,
  handleSortDirectionSelect,
  handleClearSortRow,
}: SortRowProps) {
  const t = useCustomTranslation();
  const selectedSortOption = sortOptions.find(s => s.value === row.sortId);

  return (
    <div key={index} className="flex items-start gap-2 flex-wrap w-full">
      <DropdownMenuCustom
        list_menu={sortOptions.map(sort => {
          const isCurrent = row.sortId === sort.value;
          const isUsedElsewhere = !isCurrent && selectedSortSet.has(sort.value);
          return {
            label: sort.label,
            value: sort.value,
            disabled: isCurrent || isUsedElsewhere,
          };
        })}
        triggerType="click"
        menuWidth="w-50"
        align="start"
        onSelectionChange={val => {
          if (typeof val === 'string') handleSortSelect(index, val);
        }}
        customTrigger={
          <CustomButton
            variant="outline"
            className="w-auto h-10 flex items-center justify-between bg-transparent"
          >
            {row.sortId ? selectedSortOption?.label : t('Select sort')}
            <ChevronDown />
          </CustomButton>
        }
      />

      {selectedSortOption && (
        <div className="flex items-center justify-center">
          <DropdownMenuCustom
            list_menu={selectedSortOption.options.map(option => ({
              label: option.label,
              value: option.value,
            }))}
            triggerType="click"
            menuWidth="w-50"
            align="start"
            onSelectionChange={val => {
              if (typeof val === 'string') handleSortDirectionSelect(index, val);
            }}
            customTrigger={
              <CustomButton
                variant="outline"
                className="w-auto h-10 flex items-center justify-between bg-transparent"
              >
                {row.direction
                  ? selectedSortOption.options.find(o => o.value === row.direction)?.label
                  : t('Select direction')}
                <ChevronDown />
              </CustomButton>
            }
          />
          <Trash2
            className="h-4 w-4 cursor-pointer ml-2"
            onClick={() => handleClearSortRow(index)}
          />
        </div>
      )}
    </div>
  );
}
