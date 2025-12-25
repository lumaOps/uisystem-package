'use client';

import * as React from 'react';
import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/button/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { CollapsibleCustomProps } from '@/types/common/collapsible/collapsible';
import { cn } from '@/utils/utils';

export function CollapsibleCustom({
  title = 'Collapsible Section',
  defaultOpen = false,
  defaultContent = '@radix-ui/primitives',
  collapsibleContent,
  className = 'w-[350px] space-y-2',
  defaultContentClassName = '',
  titleClassName = '',
}: CollapsibleCustomProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className={cn('text-sm font-semibold ', titleClassName)}>{title}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <div
        className={cn('rounded-md border px-4 py-3 font-mono text-sm ', defaultContentClassName)}
      >
        {defaultContent}
      </div>

      <CollapsibleContent className="space-y-2">{collapsibleContent}</CollapsibleContent>
    </Collapsible>
  );
}
