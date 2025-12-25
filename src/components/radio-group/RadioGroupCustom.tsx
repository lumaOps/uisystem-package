'use client';

import * as React from 'react';
import { RadioGroup, RadioGroupItem, RadioGroupValue } from './radio-group';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import { RadioGroupCustomProps } from '@/types/common/radio-group/radioGroup';

function RadioGroupCustom<T extends RadioGroupValue = RadioGroupValue>({
  data,
  name,
  value,
  defaultValue,
  onValueChange,
  itemClassName,
  labelClassName,
  descriptionClassName,
  containerClassName,
  orientation = 'vertical',
  radioClassName,
  disabled = false,
  required = false,
  errorMessage,
  description,
  label,
  tooltipContent,
  ...props
}: RadioGroupCustomProps<T>) {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      <div>
        {/* Group Label */}
        {label && (
          <Label
            className={cn(
              'text-sm font-medium leading-none',
              disabled && 'cursor-not-allowed opacity-70',
              labelClassName
            )}
            tooltipContent={tooltipContent}
            showTooltip={!!tooltipContent}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}

        {/* Group Description */}
        {description && (
          <p className={cn('text-sm text-muted-foreground', descriptionClassName)}>{description}</p>
        )}
      </div>
      {/* Radio Group */}
      <RadioGroup
        value={
          value !== undefined
            ? String(value)
            : defaultValue !== undefined
              ? String(defaultValue)
              : data && data?.length > 0
                ? String(data[0].value)
                : undefined
        }
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        {...props}
        className={cn(
          orientation === 'vertical'
            ? 'flex flex-col items-start gap-6 w-full'
            : 'flex flex-row gap-3',
          radioClassName
        )}
      >
        {data?.map(option => {
          const isDisabled = disabled || option.disabled;
          const hasDescription = !!option.description;

          return (
            <div
              key={`${name || 'radio'}-${String(option.value)}`}
              className={cn(
                'flex space-x-3',
                hasDescription ? 'items-start' : 'items-center',
                itemClassName
              )}
            >
              <RadioGroupItem
                value={String(option.value)}
                id={`${name || 'radio'}-${String(option.value)}`}
                disabled={isDisabled}
                className="mt-0.5" // Optional: slight tweak if needed
              />
              <div className="flex-1">
                <Label
                  htmlFor={`${name || 'radio'}-${String(option.value)}`}
                  className={cn(
                    'text-sm font-medium leading-none cursor-pointer',
                    'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    isDisabled && 'cursor-not-allowed opacity-70',
                    labelClassName
                  )}
                  tooltipContent={option.tooltipContent}
                  showTooltip={!!option.tooltipContent}
                >
                  {option.label}
                </Label>
                {hasDescription && (
                  <p className={cn('text-xs text-muted-foreground', descriptionClassName)}>
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroup>

      {/* Error Message */}
      {errorMessage && (
        <p className="flex items-center gap-1 text-xs font-medium text-destructive mt-1">
          {/* Optionally, add an AlertCircle icon here if desired */}
          {/* <AlertCircle className="h-3 w-3 mr-1" /> */}
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export { RadioGroupCustom };
export type { RadioGroupCustomProps };
