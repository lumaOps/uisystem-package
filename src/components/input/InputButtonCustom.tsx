import * as React from 'react';
import { Input } from './Input';
import { Label } from '@/components/label/Label';
import { CustomButton } from '@/components/button/CustomButton';
import { cn } from '@/utils/utils';

export interface InputButtonCustomProps {
  id?: string;
  label?: string;
  description?: string;
  tooltipContent?: string;
  errorMessage?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonLabel: string;
  onButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  placeholder?: string;
  name?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export const InputButtonCustom = React.forwardRef<HTMLInputElement, InputButtonCustomProps>(
  (
    {
      id,
      label,
      description,
      tooltipContent,
      errorMessage,
      value,
      onChange,
      buttonLabel,
      onButtonClick,
      inputProps,
      buttonProps,
      className,
      labelClassName,
      containerClassName,
      inputClassName,
      buttonClassName,
      placeholder,
      isLoading,
      disabled,
    },
    ref
  ) => {
    const hasError = !!errorMessage;
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
            'group flex h-10 items-center rounded-md border bg-background text-sm ring-offset-background',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:border-primary',
            'shadow-sm hover:shadow-base',
            'has-disabled:cursor-not-allowed has-disabled:opacity-50',
            { 'border-destructive': hasError },
            containerClassName
          )}
        >
          <Input
            ref={ref}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={cn(
              'flex-1 w-full h-full border-0 bg-transparent px-3 py-0 text-sm shadow-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none',
              inputClassName
            )}
            disabled={disabled}
            {...inputProps}
          />
          <CustomButton
            type="button"
            variant="default"
            onClick={onButtonClick}
            className={cn(
              'h-8 px-6 m-1 rounded-md text-sm font-normal',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
              'transition-all',
              buttonClassName
            )}
            style={{ minWidth: 100 }}
            isLoading={isLoading}
            disabled={disabled}
            {...buttonProps}
          >
            {buttonLabel}
          </CustomButton>
        </div>
        {description && !hasError && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
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

InputButtonCustom.displayName = 'InputButtonCustom';
