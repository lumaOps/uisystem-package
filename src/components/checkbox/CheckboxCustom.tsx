'use client';

import * as React from 'react';
import { Checkbox } from './Checkbox'; // <-- Use primitive from same folder
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import { CheckboxCustomProps } from '@/types/common/checkbox/checkboxCustom'; // Import the type

// Define props based on the Primitive's props + custom ones
// export interface CheckboxCustomProps  <-- Remove this section
//   extends Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'onChange' | 'id'> {
//   label?: React.ReactNode;
//   description?: string;
//   labelClassName?: string;
//   descriptionClassName?: string;
//   containerClassName?: string;
//   id: string;
// }

const CheckboxCustom: React.FC<CheckboxCustomProps> = ({
  label,
  description,
  errorMessage,
  className,
  labelClassName,
  descriptionClassName,
  containerClassName,
  id,
  name,
  tooltipContent,
  ...props
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      <div className={cn('flex items-center space-x-2', containerClassName)}>
        <Checkbox id={id} name={name} {...props} /> {/* Use Primitive */}
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              labelClassName
            )}
            tooltipContent={tooltipContent}
            showTooltip={!!tooltipContent}
          >
            {label}
          </Label>
        )}
      </div>
      {description && (
        <p className={cn('text-sm text-muted-foreground', descriptionClassName)}>{description}</p>
      )}
      {/* Display error message if provided */}
      {errorMessage && (
        <p
          // Consider adding an id like `${id}-error` if needed for ARIA
          className="flex items-center gap-1 text-xs font-medium text-destructive mt-1"
        >
          {/* Optionally, add an AlertCircle icon here if desired */}
          {/* <AlertCircle className="h-3 w-3 mr-1" /> */}
          {errorMessage}
        </p>
      )}
    </div>
  );
};

CheckboxCustom.displayName = 'CheckboxCustom';

export { CheckboxCustom };
