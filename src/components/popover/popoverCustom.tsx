'use client';

import * as React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { cn } from '@/utils/utils';
import { PopoverCustomProps } from '@/types/common/popover/popoverCustom';

export const PopoverCustom: React.FC<PopoverCustomProps> = ({
  trigger,
  children,
  contentClassName = '',
  align = 'start',
  sideOffset = 4,
  open,
  onOpenChange,
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent
        side="bottom"
        align={align}
        sideOffset={sideOffset}
        className={cn('w-96 p-4 bg-background rounded-md shadow-md', contentClassName)}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};
