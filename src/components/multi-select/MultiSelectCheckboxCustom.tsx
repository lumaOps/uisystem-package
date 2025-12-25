'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils/utils';
import { CustomButton } from '@/components/button/CustomButton';
import { CheckboxCustom } from '@/components/checkbox/CheckboxCustom';
import DropdownMenuCustom from '@/components/dropdown-menu/DropdownMenuCustom';
import { MultiSelectCustomProps } from '@/types/common/multi-select';

export const MultiSelectCheckboxCustom: React.FC<MultiSelectCustomProps> = ({
  options,
  value = [],
  onChange,
  placeholder = 'Select options...',
  className,
  disabled = false,
  maxSelected,
  searchPlaceholder = 'Search options...',
  emptyMessage = 'No options found.',
  searchable = true,
  id,
  name,
}) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value);

  React.useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  const selectedOptions = options.filter(option => selectedValues.includes(option.value));
  const displayText = selectedOptions.map(option => option.label).join(', ');

  const handleSelect = (optionValue: string) => {
    let newValue: string[] = [];

    if (value.includes(optionValue)) {
      // remove
      newValue = value.filter(item => item !== optionValue);
    } else if (!maxSelected || value.length < maxSelected) {
      // add
      newValue = [...value, optionValue];
    } else {
      newValue = value;
    }

    setSelectedValues(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={cn('w-full', className)}>
      <DropdownMenuCustom
        list_menu={options.map(option => ({
          value: option.value,
          label: option.label,
          checked: selectedValues.includes(option.value),
          icon: (
            <CheckboxCustom
              id={`checkbox-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleSelect(option.value)}
              onClick={e => e.stopPropagation()}
              className="flex items-center justify-center"
            />
          ),
        }))}
        triggerType="click"
        allowMultiple
        menuWidth="w-full"
        side="bottom"
        align="start"
        searchable={searchable} // Utiliser la prop
        searchPlaceholder={searchPlaceholder}
        noResultsText={emptyMessage}
        customTrigger={
          <CustomButton
            id={id}
            name={name}
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-between min-h-10 h-auto',
              !selectedValues.length && 'text-muted-foreground'
            )}
            disabled={disabled}
          >
            <div className="flex-1 text-left min-w-0">
              {selectedValues.length > 0 ? (
                <span className="block truncate max-w-full">{displayText}</span>
              ) : (
                <span className="text-muted-foreground truncate">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </CustomButton>
        }
        onSelectionChange={val => handleSelect(val as string)}
      />
    </div>
  );
};
