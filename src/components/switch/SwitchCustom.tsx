'use client';

import React from 'react';
import { Label } from '../label/Label';
import { cn } from '@/utils/utils';
import { Switch } from './switch';
import * as SwitchPrimitive from '@radix-ui/react-switch';

export interface SwitchCustomProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  label?: React.ReactNode;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  className?: string;
  containerClassName?: string;
  id: string;
  name?: string;
  tooltipContent?: string;
}

const SwitchCustom: React.FC<SwitchCustomProps> = ({
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
        <Switch id={id} name={name} {...props} />

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
      {errorMessage && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-500 mt-1">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

SwitchCustom.displayName = 'SwitchCustom';

export { SwitchCustom };
