'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';
import { BadgeCustom } from '@/components/badge/BadgeCustom';
import { Label } from '@/components/label/Label';
import { DaySelectorProps } from '@/types/common/day-selector/daySelector';
import { DEFAULT_DAYS } from '@/constants/daySelector';

export function DaySelector({
  label = 'Post Days',
  labelClassName,
  value = [],
  onChange,
  days = DEFAULT_DAYS,
  className,
  badgeClassName,
  containerClassName,
  showSelectedCount = true,
  selectedCountText = 'Days Selected',
  disabled = false,
}: DaySelectorProps) {
  const handleDayToggle = (dayValue: number) => {
    if (disabled) return;

    const newDays = value.includes(dayValue)
      ? value.filter(d => d !== dayValue)
      : [...value, dayValue];

    onChange(newDays);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label className={cn('text-sm font-medium', labelClassName)}>{label}</Label>}
      <div className={cn('flex gap-2', containerClassName)}>
        {days.map(day => (
          <BadgeCustom
            key={day.value}
            onClick={() => handleDayToggle(day.value)}
            variant={value.includes(day.value) ? 'primary' : 'secondary'}
            className={cn(
              'px-5 py-2 text-sm font-normal rounded-full cursor-pointer transition-colors',
              disabled && 'opacity-50 cursor-not-allowed',
              badgeClassName
            )}
          >
            {day.label}
          </BadgeCustom>
        ))}
      </div>
      {showSelectedCount && (
        <p className="text-xs text-muted-foreground">
          {value.length} {selectedCountText}
        </p>
      )}
    </div>
  );
}
