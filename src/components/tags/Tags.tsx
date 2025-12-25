'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Badge } from '@/components/badge/Badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/command/command';

interface TagsProps {
  id?: string;
  value?: (string | number)[];
  onValueChange?: (value: (string | number)[]) => void;
  placeholder?: string;
  inside?: boolean;
  className?: string;
  options?: { value: string | number; label: string }[];
  errorMessage?: string;
}

export const Tags = ({
  id,
  value = [],
  onValueChange,
  placeholder = 'Add item...',
  className,
  options = [],
  inside = true,
  errorMessage,
}: TagsProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleRemove = (itemToRemove: string | number) => {
    const newValue = value.filter(item => item !== itemToRemove);
    onValueChange?.(newValue);
  };

  const handleAdd = (item: string | number) => {
    if (!value.includes(String(item))) {
      const newValue = [...value, item];
      onValueChange?.(newValue);
    }
    setInputValue('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter key from adding custom text
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const filteredOptions = options.filter(
    option =>
      !value.includes(String(option.value)) &&
      option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={cn('relative', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text">
            {inside ? (
              <div className="flex flex-wrap gap-1">
                {value.map((item, index) => (
                  <Badge key={`${item}-${index}`} variant="secondary" className="gap-1">
                    {options.find(opt => opt.value === item)?.label || item}
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemove(item);
                      }}
                      className="ml-1 hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
                {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              <CommandEmpty>No options available</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleAdd(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {!inside && (
        <div className="mt-1 min-h-[40px] w-full rounded-md bg-background px-1 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text">
          <div className="flex flex-wrap gap-1">
            {value.map((item, index) => (
              <Badge
                key={`${item}-${index}`}
                variant="secondary"
                className="gap-1 rounded-4xl font-normal border border-border"
              >
                {options.find(opt => opt.value === item)?.label || item}
                <div
                  onClick={e => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className="ml-1 hover:text-destructive cursor-pointer"
                >
                  <X size={12} />
                </div>
              </Badge>
            ))}
            {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
          </div>
        </div>
      )}
      {errorMessage && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1 text-xs font-medium text-destructive"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
};
