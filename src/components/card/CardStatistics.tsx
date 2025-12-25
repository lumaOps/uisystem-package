import React, { memo } from 'react';
import { CardCustom } from '@/components/card/CardCustom';
import { HelpCircle } from 'lucide-react';
import { TooltipCustom } from '../tooltip/TooltipCustom';
import { CardStatisticsProps } from '@/types/global-types';
import { cn } from '@/utils/utils';

export const CardStatistics: React.FC<CardStatisticsProps> = memo(
  ({
    title,
    value,
    colorClass,
    tooltip,
    icon,
    iconWithBorder,
    className,
    titleClassName,
    onSelectCard,
  }) => {
    return (
      <CardCustom containerClassName={cn('p-0', className)} contentClassName="py-4 px-1">
        <div className={`flex items-center min-h-16  ${icon ? '' : ''} `} onClick={onSelectCard}>
          {/* Info block */}
          <div className={`flex items-center gap-4 pl-3 min-w-0`}>
            {colorClass && (
              <div className={`w-2 h-14 rounded shrink-0 ${colorClass}`} aria-hidden="true" />
            )}
            {icon && (
              <div
                className={`flex items-center justify-center h-10 w-10 text-primary ${
                  iconWithBorder ? 'border border-border rounded-lg' : ''
                }`}
              >
                {icon}
              </div>
            )}

            <div className="flex flex-col justify-center min-w-0 gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-muted-foreground text-sm font-semibold truncate',
                    titleClassName
                  )}
                >
                  {title}
                </span>
                {tooltip && (
                  <TooltipCustom
                    className={titleClassName}
                    content={<p>{tooltip}</p>}
                    delayDuration={100}
                  >
                    <HelpCircle
                      className="h-3 w-3 text-muted-foreground cursor-help shrink-0"
                      aria-label={`Help for ${title}`}
                    />
                  </TooltipCustom>
                )}
              </div>
              <div className="text-foreground font-bold text-2xl truncate">
                {value || value === 0 ? value : '-'}
              </div>
            </div>
          </div>
        </div>
      </CardCustom>
    );
  }
);

CardStatistics.displayName = 'CardStatistics';
