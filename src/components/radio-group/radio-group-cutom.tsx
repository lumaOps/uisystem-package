'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';
import { RadioGroupItem } from './radio-group';

interface RadioItemCustomProps {
  value: string | number | boolean;
  id?: string;
  title: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  alignTop?: boolean;
}

function RadioItemCustom({
  value,
  id,
  title,
  description,
  disabled,
  className,
  titleClassName,
  descriptionClassName,
  alignTop = false,
}: RadioItemCustomProps) {
  return (
    <div className={cn('flex gap-2', alignTop ? 'items-start' : 'items-center', className)}>
      <RadioGroupItem value={value} id={id} disabled={disabled} />
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className={cn('text-sm font-medium leading-none', titleClassName)}>
          {title}
        </label>
        {description && (
          <p className={cn('text-xs text-muted-foreground', descriptionClassName)}>{description}</p>
        )}
      </div>
    </div>
  );
}

export { RadioItemCustom };
