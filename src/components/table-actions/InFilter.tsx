'use client';

import { ChevronDown, Trash2, X } from 'lucide-react';
import { CustomButton } from '../button/CustomButton';
import DropdownMenuCustom from '../dropdown-menu/DropdownMenuCustom';
import { CheckboxCustom } from '../checkbox/CheckboxCustom';
import { BadgeCustom } from '../badge/BadgeCustom';
import { isRowIn } from '@/types/common/filter/filterCustom';
import { InFilterProps } from '@/types/common/filter-sort-panel/filterSort';

export function InFilter({
  row,
  index,
  t,
  selectedCategory,
  handleOptionToggle,
  handleClearRow,
}: InFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenuCustom
        list_menu={selectedCategory.options.map(option => ({
          label: option.label,
          value: option.id,
          checked: isRowIn(row) && row.options.includes(option.id),
          icon: (
            <CheckboxCustom
              id={`CheckboxFilter-${selectedCategory.id}-${option.id}`}
              checked={isRowIn(row) && row.options.includes(option.id)}
              onCheckedChange={() => handleOptionToggle(index, option.id)}
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center"
            />
          ),
        }))}
        side="bottom"
        menuWidth="w-50"
        align="start"
        triggerType="click"
        onSelectionChange={val => handleOptionToggle(index, val as string)}
        customTrigger={
          <CustomButton
            variant="outline"
            className="w-auto h-10 flex items-center justify-between bg-transparent shrink-0"
          >
            {t(`Select ${selectedCategory.label.toLowerCase()}`)}
            <ChevronDown />
          </CustomButton>
        }
      />

      {isRowIn(row) && row.options.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {row.options.map(optionId => {
            const option = selectedCategory.options.find(o => o.id === optionId);
            if (!option) return null;
            return (
              <BadgeCustom
                key={optionId}
                variant="secondary"
                className="flex items-center gap-2 border border-status-gray-background"
              >
                <span className="text-sm leading-normal font-medium">{option.label}</span>
                <X
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => handleOptionToggle(index, optionId)}
                />
              </BadgeCustom>
            );
          })}
        </div>
      )}

      <Trash2 className="h-4 w-4 cursor-pointer ml-2" onClick={() => handleClearRow(index)} />
    </div>
  );
}
