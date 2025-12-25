'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/utils';
import { ComboboxDropdown, ComboboxInput } from './Combobox';
import type { ComboboxCustomProps } from '@/types/common/combobox/combobox';
import type { SelectOption } from '@/types/common/select/selectCustom';

interface ComboboxState {
  inputValue: string;
  selectedValue: number | string | null;
  showPopover: boolean;
  dynamicOptions: SelectOption[]; // Only for solo combobox mode
  type?: string;
}

type ComboboxAction =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_SELECTED'; payload: { value: number | string; label: string } }
  | { type: 'TOGGLE_POPOVER'; payload?: boolean }
  | { type: 'ADD_OPTION'; payload: SelectOption }
  | { type: 'SYNC_EXTERNAL'; payload: { options: SelectOption[]; value?: number | string | null } }
  | { type: 'RESET_OPTIONS'; payload: { options: SelectOption[]; value?: number | string | null } };

const comboboxReducer = (state: ComboboxState, action: ComboboxAction): ComboboxState => {
  switch (action.type) {
    case 'SET_INPUT':
      return {
        ...state,
        inputValue: action.payload,
        showPopover: true,
      };

    case 'SET_SELECTED':
      return {
        ...state,
        inputValue: action.payload.label,
        selectedValue: action.payload.value,
        showPopover: false,
      };

    case 'TOGGLE_POPOVER':
      return {
        ...state,
        showPopover: action.payload ?? !state.showPopover,
      };

    case 'ADD_OPTION': {
      const exists = state.dynamicOptions.some(
        opt => String(opt.value) === String(action.payload.value)
      );
      return exists
        ? state
        : { ...state, dynamicOptions: [...state.dynamicOptions, action.payload] };
    }

    case 'SYNC_EXTERNAL': {
      const { options, value } = action.payload;

      if (!value) {
        return {
          ...state,
          inputValue: '',
          selectedValue: null,
        };
      }

      const existingOption = options.find(opt => String(opt.value) === String(value));
      const inputLabel = existingOption?.label ?? String(value);

      return {
        ...state,
        inputValue: inputLabel,
        selectedValue: value,
      };
    }

    case 'RESET_OPTIONS':
      return {
        dynamicOptions: [],
        inputValue: '',
        selectedValue: null,
        showPopover: false,
      };

    default:
      return state;
  }
};

export const ComboboxCustom: React.FC<ComboboxCustomProps> = ({
  options,
  label,
  placeholder = 'Select an option...',
  onChange,
  name = '',
  errorMessage = '',
  tooltipContent,
  value = null,
  disabled,
  type = 'text',
  isMultiple = false, // prop to distinguish between solo and multiple mode
}) => {
  const [state, dispatch] = React.useReducer(comboboxReducer, {
    inputValue: '',
    selectedValue: value ?? null,
    showPopover: false,
    dynamicOptions: options,
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    dispatch({
      type: 'SYNC_EXTERNAL',
      payload: { options, value },
    });
  }, [options, value]);

  const effectiveOptions = React.useMemo(() => {
    if (isMultiple) {
      // In multiple mode, use only the provided options (managed by parent)
      return options;
    } else {
      // In solo mode, merge provided options with local custom options
      const mergedOptions = [...options];

      state.dynamicOptions.forEach(customOpt => {
        if (!mergedOptions.some(opt => String(opt.value) === String(customOpt.value))) {
          mergedOptions.push(customOpt);
        }
      });

      return mergedOptions;
    }
  }, [options, state.dynamicOptions, isMultiple]);

  const filteredOptions = React.useMemo(() => {
    const search = state.inputValue.trim().toLowerCase();
    if (!search) return effectiveOptions;

    const matched = effectiveOptions.filter(opt =>
      String(opt.label).toLowerCase().includes(search)
    );

    const hasExactMatch = effectiveOptions.some(opt => String(opt.label).toLowerCase() === search);

    const hasStartsWithMatch = effectiveOptions.some(opt =>
      String(opt.label).toLowerCase().startsWith(search)
    );

    return !hasExactMatch && !hasStartsWithMatch
      ? [...matched, { value: state.inputValue, label: state.inputValue }]
      : matched;
  }, [state.inputValue, effectiveOptions]);

  const displayPlaceholder = React.useMemo(() => {
    if (!state.selectedValue) return placeholder;

    const selectedOption = effectiveOptions.find(
      opt => String(opt.value) === String(state.selectedValue)
    );

    return selectedOption?.label ?? String(state.selectedValue);
  }, [state.selectedValue, effectiveOptions, placeholder]);

  const handleSelect = React.useCallback(
    (val: string | number, label: string) => {
      const newOption = { value: val, label };

      // Only add to local options if in solo mode and option doesn't exist
      if (!isMultiple) {
        const optionExists = effectiveOptions.some(opt => String(opt.value) === String(val));

        if (!optionExists) {
          dispatch({ type: 'ADD_OPTION', payload: newOption });
        }
      }

      dispatch({ type: 'SET_SELECTED', payload: newOption });
      onChange(newOption);
    },
    [onChange, isMultiple, effectiveOptions]
  );

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_INPUT', payload: e.target.value });
  }, []);

  const handleEnter = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();

        const exact = state.dynamicOptions.find(
          opt => String(opt.label).toLowerCase() === state.inputValue.toLowerCase()
        );

        const optionToSelect = exact
          ? { value: exact.value, label: exact.label }
          : { value: state.inputValue, label: state.inputValue };

        handleSelect(optionToSelect.value, optionToSelect.label);
      }
    },
    [state.dynamicOptions, state.inputValue, handleSelect]
  );

  const togglePopover = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_POPOVER' });
  }, []);

  const closeDropdown = React.useCallback(() => {
    dispatch({ type: 'TOGGLE_POPOVER', payload: false });
  }, []);

  const endIcon = React.useMemo(() => <ChevronDown onClick={togglePopover} />, [togglePopover]);

  return (
    <div className="w-full">
      <div className="relative w-full" ref={containerRef}>
        <div className="relative">
          <ComboboxInput
            id={`combobox-${name}`}
            name={name}
            label={label}
            placeholder={displayPlaceholder}
            value={state.inputValue}
            tooltipContent={tooltipContent}
            onChange={handleInputChange}
            onClick={togglePopover}
            ref={inputRef}
            errorMessage={errorMessage}
            onKeyDown={handleEnter}
            disabled={disabled}
            endIcon={endIcon}
            autoComplete="off"
            endIconClassName={cn(
              'cursor-pointer w-4 h-4 text-muted-foreground transition-transform',
              { 'rotate-180': state.showPopover }
            )}
            type={type}
          />
        </div>
        {state.showPopover && (
          <ComboboxDropdown
            closeDropdown={closeDropdown}
            containerRef={containerRef}
            options={filteredOptions}
            onSelect={handleSelect}
            selectedValue={state.selectedValue ?? ''}
          />
        )}
      </div>
    </div>
  );
};
