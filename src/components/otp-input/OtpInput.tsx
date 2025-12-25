'use client';

import * as React from 'react';
import { OTPInput } from 'input-otp'; // Import directly from the library
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
// import { AlertCircle } from 'lucide-react';

export interface OtpInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  numInputs?: number;
  description?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string; // Applied to the root OTPInput container
  slotClassName?: string; // Applied to each slot div
  name?: string;
  id: string;
  tooltipContent?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({
  label,
  value,
  onChange,
  numInputs = 6,
  description,
  errorMessage,
  disabled,
  className,
  labelClassName,
  containerClassName, // Pass this to OTPInput
  slotClassName,
  name,
  id,
  tooltipContent,
}) => {
  const hasError = !!errorMessage;

  return (
    <div className={cn('space-y-1', className)}>
      {' '}
      {/* Main wrapper */}
      {label && (
        <Label
          htmlFor={id}
          className={cn('text-sm font-medium', labelClassName)}
          tooltipContent={tooltipContent}
          showTooltip={!!tooltipContent}
        >
          {label}
        </Label>
      )}
      <OTPInput // Use the base component directly
        maxLength={numInputs}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        id={id}
        containerClassName={cn(
          // Style the container provided by OTPInput
          'flex items-center gap-2', // Use gap for spacing
          'has-disabled:opacity-50',
          containerClassName
        )}
        render={({ slots }) =>
          // No extra group needed, map directly
          slots.map((slot, index) => (
            <div // Render a simple div for the slot
              key={index}
              className={cn(
                // Base styling for the slot
                'relative flex h-10 w-10 items-center justify-center',
                'border border-input text-sm transition-all rounded-md',
                // Active state
                slot.isActive && 'z-10 ring-2 border border-primary ring-ring ',
                // Error state styling
                {
                  'border-destructive text-destructive': hasError,
                  '': hasError && slot.isActive,
                },
                slotClassName // Allow overriding
              )}
            >
              {slot.char} {/* Display character */}
              {/* Display caret */}
              {slot.hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
                </div>
              )}
            </div>
          ))
        }
      />
      {description && !hasError && <p className="text-xs text-muted-foreground">{description}</p>}
      {hasError && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1 text-xs font-medium text-destructive mt-1"
        >
          {/* <AlertCircle className="h-3 w-3" /> */}
          {errorMessage}
        </p>
      )}
    </div>
  );
};

OtpInput.displayName = 'OtpInput';

export { OtpInput };
