'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/utils/utils';
import { TooltipCustom } from '../tooltip/TooltipCustom';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  tooltipContent?: string;
  showTooltip?: boolean;
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, tooltipContent, showTooltip = false, children, ...props }, ref) => {
    const labelContent = React.useMemo(() => {
      if (typeof children === 'string') {
        const trimmedChildren = children.trimEnd();

        if (trimmedChildren.endsWith('*')) {
          const textWithoutAsterisk = trimmedChildren.slice(0, -1);
          const leadingSpaces = children.substring(
            0,
            children.indexOf(trimmedChildren[0]) > -1 ? children.indexOf(trimmedChildren[0]) : 0
          );

          return (
            <>
              {leadingSpaces}
              {textWithoutAsterisk}
              <span className="text-destructive">*</span>
            </>
          );
        }
      }
      return children;
    }, [children]);

    return (
      <div className="flex items-center">
        <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props}>
          {labelContent}
        </LabelPrimitive.Root>
        {showTooltip && tooltipContent && (
          <TooltipCustom content={<p>{tooltipContent}</p>} delayDuration={100}>
            <HelpCircle className="h-3 w-3 ml-1.5 text-muted-foreground cursor-help" />
          </TooltipCustom>
        )}
      </div>
    );
  }
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
