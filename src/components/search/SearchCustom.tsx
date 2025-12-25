'use client';

import type React from 'react';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { InputCustom } from '../input/InputCustom';
import type { SearchCustomProps } from '@/types/common/search/searchCustom';

import { useDebounce } from '@/components/editor/editor-hooks/use-debounce';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

export default function SearchCustom({
  onSearchChange,
  defaultSearchValue = '',
  placeholder = 'Search...',
  className = '',
  disabled = false,
  searchOnType = false, // Default to false for backward compatibility
  isDropdown = false,
  options = [],
  onOptionSelect,
  selectedOptions = [],
  multiple = false,
  renderOption,
  maxHeight = 'max-h-64',
  isLoading = false,
  externalRef,
  isSubmitting = false,
}: SearchCustomProps) {
  const t = useCustomTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [justSelected, setJustSelected] = useState(false);
  const internalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = externalRef || internalRef;
  // Debounced search function - shorter delay for smoother experience
  const debouncedSearch = useDebounce((value: string) => {
    // Call the parent's onSearchChange with debounced value
    onSearchChange?.(value);
  }, 150);

  useEffect(() => {
    if (defaultSearchValue && !searchValue) {
      setSearchValue(defaultSearchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isDropdown) return;

    if (isSubmitting) {
      setIsOpen(false);
      setFilteredOptions([]);
      return;
    }

    if (!searchValue.trim()) {
      setIsOpen(false);
      setFilteredOptions([]);
      return;
    }

    // Don't reopen dropdown if we just selected an option
    if (justSelected) {
      return;
    }

    if (options.length > 0) {
      setFilteredOptions(options);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [options, isDropdown, searchValue, isSubmitting, justSelected]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);

      // Reset justSelected flag when user starts typing
      if (justSelected) {
        setJustSelected(false);
      }

      // Close dropdown if search is cleared
      if (isDropdown && !value.trim()) {
        setIsOpen(false);
        setFilteredOptions([]);
      }

      // Search behavior based on props
      if (isDropdown) {
        debouncedSearch(value);
      } else if (searchOnType) {
        onSearchChange?.(value);
      }
    },
    [debouncedSearch, isDropdown, searchOnType, onSearchChange, justSelected]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSearchChange?.(searchValue);
      }
    },
    [searchValue, onSearchChange]
  );

  const handleReset = useCallback(() => {
    setSearchValue('');
    onSearchChange?.('');
    if (isDropdown) {
      setFilteredOptions([]);
      setIsOpen(false);
    }
  }, [onSearchChange, isDropdown]);

  const handleOptionSelect = useCallback(
    (option: { value: string; label: string; vehicle?: unknown; [key: string]: unknown }) => {
      if (isDropdown && onOptionSelect) {
        onOptionSelect(option);
        // Always close dropdown after selection, regardless of multiple setting
        setIsOpen(false);
        setFilteredOptions([]);
        setJustSelected(true);
        if (!multiple) {
          setSearchValue(option.label);
        }
      }
    },
    [isDropdown, onOptionSelect, multiple]
  );

  useEffect(() => {
    if (!isDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdown, isOpen, dropdownRef]);

  const startIcon = useMemo(() => <Search />, []);
  const endIcon = useMemo(() => {
    return searchValue ? <X onClick={handleReset} /> : null;
  }, [searchValue, handleReset]);

  return (
    <div className={`relative ${className}`}>
      <InputCustom
        id="search-input"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        inputClassName="w-full text-sm font-normal pr-10 bg-background border-border focus:border-ring focus:ring-ring"
        startIcon={startIcon}
        endIcon={endIcon}
        endIconClassName="cursor-pointer"
        disabled={disabled}
        autoComplete="off"
      />

      {isDropdown && isOpen && filteredOptions.length > 0 && (
        <div
          className={`absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 ${maxHeight} overflow-y-auto`}
        >
          {filteredOptions.map((option, index) => {
            const isSelected = selectedOptions.some(selected => selected.value === option.value);
            return (
              <div
                key={option.value || index}
                onClick={() => handleOptionSelect(option)}
                className={`p-2 rounded-md m-2 cursor-pointer transition-colors ${
                  isSelected ? 'bg-muted/70' : 'hover:bg-muted/30'
                }`}
              >
                {renderOption ? renderOption(option, isSelected) : option.label}
              </div>
            );
          })}
        </div>
      )}

      {isDropdown && (
        <div className="mt-2">
          {isLoading && searchValue.trim() && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs">{t('Searching...')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
