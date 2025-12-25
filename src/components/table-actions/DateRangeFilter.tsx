'use client';

import { ChevronDown, Trash2 } from 'lucide-react';
import { CustomButton } from '../button/CustomButton';
import { DatePickerCustom } from '../date-picker/DatePickerCustom';
import { formatDateLocal } from '@/utils/helpers/helperFunctions';
import { DateRangeFilterProps } from '@/types/common/filter-sort-panel/filterSort';
import { isValidNumericOperator } from '@/utils/listing/listing';
import DropdownMenuCustom from '../dropdown-menu/DropdownMenuCustom';
import { isRowRange } from '@/types/common/filter/filterCustom';
import { InputCustom } from '../input/InputCustom';

export function DateRangeFilter({
  row,
  index,
  t,
  selectedCategoryId,
  handleCategorySelect,
  handleBetweenChange,
  handleClearRow,
}: DateRangeFilterProps) {
  const NUMERIC_OPERATOR_LABELS_DATES: Record<string, string> = {
    in: t('is in the last'),
    between: t('is between'),
    '>=': t('is on or after'),
    '<=': t('is before or on'),
    '=': t('is equal to'),
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Dropdown for selecting numeric operator */}
      <DropdownMenuCustom
        list_menu={[
          { label: t('is in the last'), value: 'in' },
          { label: t('is equal to'), value: '=' },
          { label: t('is between'), value: 'between' },
          { label: t('is on or after'), value: '>=' },
          { label: t('is before or on'), value: '<=' },
        ]}
        triggerType="click"
        menuWidth="w-40"
        align="start"
        onSelectionChange={val =>
          handleCategorySelect(
            index,
            selectedCategoryId,
            val as 'between' | '<=' | '>=' | '=' | 'in'
          )
        }
        customTrigger={
          <CustomButton
            variant="outline"
            className="w-auto h-10 flex items-center justify-between bg-transparent"
          >
            {row.operator === 'dates_range' && row.numericOperator
              ? (NUMERIC_OPERATOR_LABELS_DATES[row.numericOperator] ?? t('Select operator'))
              : t('Select operator')}
            <ChevronDown />
          </CustomButton>
        }
      />

      {/* Between dates */}
      {isRowRange(row) && row.numericOperator === 'between' && (
        <div className="flex flex-wrap items-center gap-2">
          <DatePickerCustom
            className="h-10"
            selected={row.options?.[0] ? new Date(row.options[0]) : undefined}
            onSelect={date =>
              handleBetweenChange(index, date ? formatDateLocal(date) : undefined, 'between', 0)
            }
            mode="single"
            as="input"
            placeholder={t('Start date')}
            buttonClassName="w-full"
          />
          <DatePickerCustom
            className="h-10"
            selected={row.options?.[1] ? new Date(row.options[1]) : undefined}
            onSelect={date =>
              handleBetweenChange(index, date ? formatDateLocal(date) : undefined, 'between', 1)
            }
            mode="single"
            as="input"
            placeholder={t('End date')}
            buttonClassName="w-full"
          />
        </div>
      )}

      {/* Single date */}
      {isRowRange(row) && isValidNumericOperator(row.numericOperator) && (
        <DatePickerCustom
          className="h-10"
          selected={
            row.options && typeof row.options === 'string' ? new Date(row.options) : undefined
          }
          onSelect={date =>
            handleBetweenChange(
              index,
              date ? formatDateLocal(date) : undefined,
              row.numericOperator
            )
          }
          mode="single"
          as="input"
          placeholder={t('Select date')}
        />
      )}
      {isRowRange(row) && row.numericOperator === 'in' && (
        <div className="flex items-center gap-2">
          <InputCustom
            id={`in-${index}`}
            type="number"
            min={1}
            placeholder="7"
            value={Array.isArray(row.inInputSelectRange) ? row.inInputSelectRange[0] : ''}
            onChange={e => handleBetweenChange(index, e, 'in', 0)}
            className="w-24"
          />
          <DropdownMenuCustom
            list_menu={[
              { label: t('Days'), value: 'days' },
              { label: t('Months'), value: 'months' },
            ]}
            triggerType="click"
            menuWidth="w-32"
            align="start"
            onSelectionChange={val =>
              handleBetweenChange(index, Array.isArray(val) ? val[0] : val, 'in', 1)
            }
            customTrigger={
              <CustomButton
                variant="outline"
                className="w-auto h-10 flex items-center justify-between bg-transparent"
              >
                {Array.isArray(row.inInputSelectRange) && row.inInputSelectRange[1]
                  ? row.inInputSelectRange[1]
                  : t('Select unit')}{' '}
                <ChevronDown />
              </CustomButton>
            }
          />
        </div>
      )}

      {/* Trash icon to clear row */}
      <Trash2 className="h-4 w-4 cursor-pointer shrink-0" onClick={() => handleClearRow(index)} />
    </div>
  );
}
