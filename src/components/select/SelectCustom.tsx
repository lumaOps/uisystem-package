'use client';

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import { SelectCustomProps, SelectOption } from '@/types/common/select/selectCustom';

// Forward ref to the Trigger element
const SelectCustom = React.forwardRef<React.ElementRef<typeof SelectTrigger>, SelectCustomProps>(
  (
    {
      label,
      options,
      placeholder,
      description,
      tooltipContent,
      errorMessage,
      className,
      labelClassName,
      triggerClassName,
      contentClassName,
      itemClassName,
      name,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!errorMessage;

    return (
      <div className={cn('space-y-1', className)}>
        {label && (
          <Label
            htmlFor={id}
            className={cn('text-sm font-medium text-foreground', labelClassName)}
            tooltipContent={typeof tooltipContent === 'string' ? tooltipContent : undefined}
            showTooltip={!!tooltipContent}
          >
            {label}
          </Label>
        )}
        <Select name={name} disabled={disabled} {...props}>
          <SelectTrigger
            ref={ref}
            id={id}
            className={cn(
              'bg-background',
              'data-[placeholder]:text-muted-foreground',
              {
                'border-destructive ring-destructive focus:ring-destructive text-destructive':
                  hasError,
              },
              triggerClassName
            )}
            disabled={disabled}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={cn(contentClassName)}>
            {options.length > 0 ? (
              options.map((option: SelectOption) => (
                <SelectItem
                  key={option.value}
                  value={String(option.value)}
                  className={cn('cursor-pointer', itemClassName)}
                  disabled={option.disabled}
                >
                  <div className="flex items-center gap-2">
                    {/* Afficher l'icône dans l'option */}
                    {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">No data available</div>
            )}
          </SelectContent>
        </Select>
        {description && !hasError && (
          <p className={cn('text-xs text-muted-foreground')}>{description}</p>
        )}
        {hasError && (
          <p
            id={`${id}-error`}
            className="flex items-center gap-1 text-xs font-medium text-destructive"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

SelectCustom.displayName = 'SelectCustom';

export { SelectCustom };
