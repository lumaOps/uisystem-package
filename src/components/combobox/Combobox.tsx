'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useEffect, useCallback } from 'react';
import { InputCustomProps } from '@/types/common/input/input';
import { InputCustom } from '../input/InputCustom';
import { cn } from '@/utils/utils';
import { SelectOption } from '@/types/common/select/selectCustom';

const ComboboxInput = React.forwardRef<HTMLInputElement, InputCustomProps>(
  ({ className, containerClassName, ...props }, ref) => (
    <InputCustom
      ref={ref}
      className={cn('w-full', className)}
      containerClassName={cn('pr-2', containerClassName)}
      {...props}
    />
  )
);
ComboboxInput.displayName = 'ComboboxInput';

const ComboboxOption = React.memo<{
  option: SelectOption;
  isSelected: boolean;
  onSelect: (value: string | number, label: string) => void;
}>(({ option, isSelected, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(option.value, option.label);
  }, [option.value, option.label, onSelect]);

  return (
    <li
      className="px-4 py-2 text-sm hover:bg-accent cursor-pointer flex items-start gap-2 w-full"
      onClick={handleClick}
    >
      <span className="break-words whitespace-normal w-full max-w-full overflow-hidden">
        {option.label}
      </span>
      {isSelected && <Check className="w-4 h-4 text-primary mt-1 shrink-0" />}
    </li>
  );
});
ComboboxOption.displayName = 'ComboboxOption';

export interface ComboboxDropdownProps {
  options: SelectOption[];
  onSelect: (value: string | number, label: string) => void;
  closeDropdown: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  selectedValue: string | number;
}

export const ComboboxDropdown = React.memo<ComboboxDropdownProps>(
  ({ options, onSelect, closeDropdown, containerRef, selectedValue }) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const container = containerRef.current;
        if (container && !container.contains(event.target as Node)) {
          closeDropdown();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeDropdown, containerRef]);

    return (
      <ul
        className={cn(
          'absolute z-20 mt-2 w-full bg-popover text-popover-foreground rounded shadow',
          'max-h-60 overflow-y-auto'
        )}
        style={{
          scrollbarWidth: 'none',
        }}
      >
        {options.length === 0 ? (
          <li className="px-4 py-2 text-sm text-muted-foreground text-center">No data available</li>
        ) : (
          options.map(option => (
            <ComboboxOption
              key={option.value}
              option={option}
              isSelected={selectedValue === option.value}
              onSelect={onSelect}
            />
          ))
        )}
      </ul>
    );
  }
);
ComboboxDropdown.displayName = 'ComboboxDropdown';

export { ComboboxInput };
