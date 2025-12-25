'use client';

import { ChevronDown, DollarSign, Trash2 } from 'lucide-react';
import { CustomButton } from '../button/CustomButton';
import { InputCustom } from '../input/InputCustom';
import { BetweenFilterProps } from '@/types/common/filter-sort-panel/filterSort';
import { isRowBetween } from '@/types/common/filter/filterCustom';
import { isValidNumericOperator } from '@/utils/listing/listing';
import DropdownMenuCustom from '../dropdown-menu/DropdownMenuCustom';

export function BetweenFilter({
  row,
  index,
  t,
  selectedCategory,
  handleCategorySelect,
  handleBetweenChange,
  handleClearRow,
}: BetweenFilterProps) {
  const NUMERIC_OPERATOR_LABELS: Record<string, string> = {
    between: t('Between'),
    '>=': t('More than'),
    '<=': t('Less than'),
    '=': t('Equal'),
  };

  return (
    <>
      {selectedCategory && selectedCategory.id && (
        <div className="flex items-center flex-wrap gap-4">
          <DropdownMenuCustom
            list_menu={[
              { label: t('Between'), value: 'between' },
              { label: t('More than'), value: '>=' },
              { label: t('Less than'), value: '<=' },
              { label: t('Equal'), value: '=' },
            ]}
            triggerType="click"
            menuWidth="w-40"
            align="start"
            onSelectionChange={val =>
              handleCategorySelect(index, selectedCategory.id, val as 'between' | '<=' | '>=' | '=')
            }
            customTrigger={
              <CustomButton
                variant="outline"
                className="w-auto h-10 flex items-center justify-between bg-transparent"
              >
                {row.operator === 'between' && row.numericOperator
                  ? (NUMERIC_OPERATOR_LABELS[row.numericOperator] ?? t('Select operator'))
                  : t('Select operator')}
                <ChevronDown />
              </CustomButton>
            }
          />

          {isRowBetween(row) && row.numericOperator === 'between' && (
            <div className="flex flex-wrap items-center gap-2">
              <InputCustom
                id={`min-${index}`}
                type="number"
                label={t('Min')}
                placeholder="123,456"
                value={row.options[0]}
                onChange={e => handleBetweenChange(index, e, 'between', 0)}
                className="flex items-center gap-3"
                {...(selectedCategory.icon === 'price' && {
                  startIcon: <DollarSign />,
                  placeholder: 'Eg. 123,456',
                  startIconClassName: 'text-foreground',
                })}
              />
              <InputCustom
                id={`max-${index}`}
                type="number"
                label={t('Max')}
                placeholder="123,456"
                value={row.options[1]}
                onChange={e => handleBetweenChange(index, e, 'between', 1)}
                className="flex items-center gap-3"
                {...(selectedCategory.icon === 'price' && {
                  startIcon: <DollarSign />,
                  placeholder: 'Eg. 123,456',
                  startIconClassName: 'text-foreground',
                })}
              />
            </div>
          )}

          {isRowBetween(row) && isValidNumericOperator(row.numericOperator) && (
            <InputCustom
              id={`single-${index}`}
              type="number"
              placeholder="123,456"
              value={row.options as string}
              onChange={e =>
                handleBetweenChange(index, e, row.numericOperator as '<=' | '>=' | '=')
              }
              className=""
              {...(selectedCategory.icon === 'price' && {
                startIcon: <DollarSign />,
                placeholder: 'Eg. 123,456',
                startIconClassName: 'text-foreground',
              })}
            />
          )}

          <Trash2
            className="h-4 w-4 cursor-pointer shrink-0"
            onClick={() => handleClearRow(index)}
          />
        </div>
      )}
    </>
  );
}
