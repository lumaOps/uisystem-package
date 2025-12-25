import * as React from 'react';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import { SelectCustom } from '@/components/select/SelectCustom';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';
import { Input } from './Input';
import { formatNumberWithCommas, getRawNumericValue } from '@/utils/helpers/helperFunctions';

export interface InputSelectCustomProps {
  id?: string;
  label?: string;
  description?: string;
  errorMessage?: string | undefined;
  tooltipContent?: string;
  value?: { input: string; select: string };
  onChange?: (name: string, value: string) => void;
  options: { value: string | number; label: string }[];
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  inputType?: string;

  selectPlaceholder?: string;
  inputPlaceholder?: string;

  // NEW
  nameInput: string;
  nameSelect: string;
  formData?: UseFormReturn<FieldValues>;
}

export const InputSelectCustom = React.forwardRef<HTMLInputElement, InputSelectCustomProps>(
  (
    {
      id,
      label,
      errorMessage,
      tooltipContent,
      onChange,
      options,
      inputProps,
      className,
      labelClassName,
      containerClassName,
      inputClassName,
      selectPlaceholder,
      inputPlaceholder,
      inputType,
      nameInput,
      nameSelect,
      formData,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState<string>('');
    const hasError =
      !!formData?.formState.errors?.[nameInput] ||
      !!formData?.formState.errors?.[nameSelect] ||
      !!errorMessage;

    const isNumberType = inputType === 'number';

    // Initialize display value for number inputs
    React.useEffect(() => {
      if (isNumberType && formData?.watch(nameInput) !== undefined) {
        const stringValue = String(formData.watch(nameInput) || '');
        setDisplayValue(formatNumberWithCommas(stringValue));
      }
    }, [formData, isNumberType, nameInput]);

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (isNumberType) {
        // Format the display value
        const formatted = formatNumberWithCommas(inputValue);
        setDisplayValue(formatted);

        // Get raw numeric value for the onChange handler
        const rawValue = getRawNumericValue(formatted);

        // Create a new event with the raw value
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: rawValue,
          },
        };

        return syntheticEvent as React.ChangeEvent<HTMLInputElement>;
      } else {
        return e;
      }
    };

    // Determine the input value to display
    const getInputValue = () => {
      const fieldValue = formData?.watch(nameInput) || '';
      return isNumberType ? displayValue : fieldValue;
    };

    return (
      <div className={cn('space-y-1', className)}>
        {label && (
          <Label
            htmlFor={id}
            className={cn('text-sm font-medium', labelClassName)}
            tooltipContent={typeof tooltipContent === 'string' ? tooltipContent : undefined}
            showTooltip={!!tooltipContent}
          >
            {label}
          </Label>
        )}
        <div
          className={cn(
            'group flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:border-primary',
            'shadow-sm hover:shadow-base',
            'has-disabled:cursor-not-allowed has-disabled:opacity-50',
            { 'border-destructive': hasError },
            containerClassName
          )}
        >
          <Controller
            name={nameInput}
            control={formData?.control}
            render={({ field }) => (
              <Input
                ref={ref}
                id={nameInput}
                type={isNumberType ? 'text' : inputType || 'text'}
                value={getInputValue()}
                onChange={e => {
                  const processedEvent = handleNumberChange(e);
                  field.onChange(processedEvent.target.value);
                  onChange?.(nameInput, processedEvent.target.value);
                }}
                placeholder={inputPlaceholder}
                className={cn(
                  'flex-1 w-full h-full border-0 bg-transparent py-0 text-sm shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0',
                  inputClassName
                )}
                {...inputProps}
              />
            )}
          />
          <div className="border-l border-input h-8 mx-1" />
          <Controller
            name={nameSelect}
            control={formData?.control}
            render={({ field }) => (
              <SelectCustom
                id={id ? `${id}-select` : 'input-select-custom-select'}
                options={options}
                value={field.value ?? ''}
                onValueChange={selectValue => {
                  field.onChange(selectValue);
                  onChange?.(nameSelect, selectValue);
                }}
                placeholder={selectPlaceholder}
                triggerClassName={cn(
                  'placeholder:text-sm bg-background placeholder:text-muted-foreground',
                  'rounded-none border-0 bg-transparent px-0 gap-2  py-0 font-medium text-foreground focus:ring-0 focus:ring-offset-0 focus:outline-none',
                  'flex items-center justify-center',
                  hasError && 'text-destructive',
                  'border-l-0 rounded-l-none rounded-r-md',
                  'shadow-none',
                  'shrink-0',
                  'border-0'
                )}
              />
            )}
          />
        </div>
        {hasError && (
          <p className="mt-1 text-xs font-medium text-destructive">
            {formData?.formState.errors?.[nameInput]?.message?.toString() ||
              formData?.formState.errors?.[nameSelect]?.message?.toString() ||
              errorMessage}
          </p>
        )}
      </div>
    );
  }
);

InputSelectCustom.displayName = 'InputSelectCustom';
