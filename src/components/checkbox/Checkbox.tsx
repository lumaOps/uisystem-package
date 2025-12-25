'use client';

import * as React from 'react';
import * as CheckboxPrimitiveRadix from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';

// Define props based on the Primitive's props
export interface CheckboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitiveRadix.Root>,
  'onChange' | 'id'
> {
  label?: React.ReactNode;
  description?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  id: string;
  tooltipContent?: string;
}

// This is now the base primitive component
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitiveRadix.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitiveRadix.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitiveRadix.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border data-[state=checked]:border-primary  shadow focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className
    )}
    {...props}
  >
    <CheckboxPrimitiveRadix.Indicator
      className={cn('flex items-center justify-center text-current')}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitiveRadix.Indicator>
  </CheckboxPrimitiveRadix.Root>
));
Checkbox.displayName = CheckboxPrimitiveRadix.Root.displayName;

const CheckboxComponent: React.FC<CheckboxProps> = ({
  label,
  description,
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
      {' '}
      {/* Outermost wrapper */}
      <div className={cn('flex items-center space-x-2', containerClassName)}>
        {' '}
        {/* Wrapper for checkbox and label text*/}
        <Checkbox id={id} name={name} {...props} />
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
    </div>
  );
};

CheckboxComponent.displayName = 'Checkbox';

export { CheckboxComponent as Checkbox };
