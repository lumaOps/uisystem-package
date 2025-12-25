'use client';

import { format, parse, isValid, isBefore, isAfter } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/utils';
import type { DateRange } from 'react-day-picker';
import { CalendarCustom } from '@/components/calendar/CalendarCustom';
import { CustomButton } from '@/components/button/CustomButton';
import { InputCustom } from '../input/InputCustom';
import type { CustomDatePickerProps } from '@/types/common/date-picker/datePickerCustom';
import { parseRangeDateString } from '@/utils/helpers/helperFunctions';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/Popover';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Label } from '../label/Label';

export const DatePickerCustom: React.FC<
  CustomDatePickerProps & {
    as?: 'button' | 'input';
    label?: string;
    labelClassName?: string;
    tooltipContent?: string;
    errorMessage?: string;
    description?: string;
    name?: string;
    id?: string;
    className?: string;
  }
> = ({
  selected,
  onSelect,
  mode = 'single',
  placeholder = 'Pick a date',
  buttonClassName = '',
  popoverClassName = '',
  calendarClassName = '',
  label = '',
  labelClassName = '',
  tooltipContent = '',
  errorMessage = '',
  description = '',
  className = '',
  name,
  id,
  as = 'button',
  numberOfMonths = 1,
  minDate,
  maxDate,
  ...calendarProps
}) => {
  const [open, setOpen] = useState(false);
  const hasError = !!errorMessage;

  // Calculate date constraints
  const dateConstraints = useMemo(() => {
    return {
      fromDate: minDate,
      toDate: maxDate,
    };
  }, [minDate, maxDate]);

  // Function to disable dates
  const disabledMatcher = useMemo(() => {
    const { fromDate, toDate } = dateConstraints;

    return (date: Date) => {
      if (fromDate && isBefore(date, fromDate)) {
        return true;
      }
      if (toDate && isAfter(date, toDate)) {
        return true;
      }
      return false;
    };
  }, [dateConstraints]);

  // Function to check if a date is disabled
  const isDateDisabled = useCallback(
    (date: Date) => {
      if (!date) return false;
      return disabledMatcher(date);
    },
    [disabledMatcher]
  );

  const displayValue = useMemo(() => {
    if (mode === 'range' && selected && 'from' in selected && selected.from) {
      const { from, to } = selected;
      if (!to || from.getTime() === to.getTime()) return format(from, 'PPP');
      return `${format(from, 'PPP')} - ${format(to, 'PPP')}`;
    }
    if (mode === 'multiple' && Array.isArray(selected)) {
      return selected && selected.length ? `${selected && selected.length} date(s)` : '';
    }
    if (mode === 'single' && selected instanceof Date) {
      return format(selected, 'yyyy-MM-dd');
    }
    return '';
  }, [selected, mode]);

  const [inputValue, setInputValue] = useState(displayValue);

  useEffect(() => {
    setInputValue(displayValue);
  }, [displayValue]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      if (mode === 'range') {
        const range = parseRangeDateString(val);
        if (range) {
          const { from, to } = range;
          // Check that dates are not disabled
          if (from && isDateDisabled(from)) return;
          if (to && isDateDisabled(to)) return;

          (onSelect as (range: DateRange | undefined) => void)?.(range);
        }
      }

      if (mode === 'single') {
        const parsed = parse(val, 'yyyy-MM-dd', new Date());
        if (isValid(parsed)) {
          // Check that date is not disabled
          if (isDateDisabled(parsed)) return;

          (onSelect as (date: Date | undefined) => void)?.(parsed);
        }
      }
    },
    [mode, onSelect, isDateDisabled]
  );

  const handleCalendarSelect = useCallback(
    (value: Date | Date[] | DateRange | undefined) => {
      // Validation for single mode
      if (mode === 'single' && value instanceof Date) {
        if (isDateDisabled(value)) {
          return; // Do not select if date is disabled
        }
      }

      // Validation for multiple mode
      if (mode === 'multiple' && Array.isArray(value)) {
        const validDates = value.filter(date => !isDateDisabled(date));
        if (validDates.length !== value.length) {
          // If some dates are invalid, select only valid dates
          if (onSelect) onSelect(validDates as never);
          return;
        }
      }

      // Validation for range mode
      if (mode === 'range' && value && 'from' in value) {
        const { from, to } = value;
        if (from && isDateDisabled(from)) {
          return; // Do not select if start date is disabled
        }
        if (to && isDateDisabled(to)) {
          return; // Do not select if end date is disabled
        }
      }

      // If everything is valid, proceed with selection
      if (onSelect) onSelect(value as never);

      if (mode === 'single' && value) {
        setOpen(false);
      } else if (mode === 'multiple' && Array.isArray(value) && value.length > 0) {
        setOpen(false);
      } else if (
        mode === 'range' &&
        value &&
        'from' in value &&
        value.from &&
        value.to &&
        value.from.getTime() !== value.to.getTime()
      ) {
        setOpen(false);
      }
    },
    [mode, onSelect, isDateDisabled]
  );

  const renderCalendar = useCallback(() => {
    const commonProps = {
      className: cn('text-xs p-1 min-w-0 w-auto max-w-fit', calendarClassName),
      classNames: {
        day: 'w-7 h-7 flex items-center rounded-md',
        day_button: 'w-7 h-7 hover:bg-primary hover:text-primary-foreground rounded-md',
        weekday: 'text-xs text-muted-foreground rounded-md w-7 font-normal text-center',
      },
      numberOfMonths,
      disabled: disabledMatcher,
      fromDate: dateConstraints.fromDate,
      toDate: dateConstraints.toDate,
      ...calendarProps,
    };

    if (mode === 'single') {
      return (
        <CalendarCustom
          mode="single"
          selected={selected as Date | undefined}
          onSelect={handleCalendarSelect}
          {...commonProps}
        />
      );
    }

    if (mode === 'multiple') {
      return (
        <CalendarCustom
          mode="multiple"
          selected={selected as Date[] | undefined}
          onSelect={handleCalendarSelect}
          {...commonProps}
        />
      );
    }

    if (mode === 'range') {
      return (
        <CalendarCustom
          mode="range"
          selected={selected as DateRange | undefined}
          onSelect={handleCalendarSelect}
          {...commonProps}
        />
      );
    }

    return null;
  }, [
    calendarClassName,
    calendarProps,
    handleCalendarSelect,
    mode,
    selected,
    numberOfMonths,
    disabledMatcher,
    dateConstraints,
  ]);

  const startIcon = useMemo(() => <CalendarIcon />, []);

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {as === 'input' ? (
            <div className="relative flex items-center">
              <InputCustom
                id={id || ''}
                name={name}
                tooltipContent={tooltipContent}
                errorMessage={errorMessage}
                label={label}
                labelClassName={labelClassName}
                description={description}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                inputClassName="w-auto text-xs font-normal pr-10"
                startIcon={startIcon}
                className={cn(
                  'h-8 text-xs font-normal rounded-md text-muted-foreground w-auto',
                  buttonClassName,
                  className
                )}
              />
            </div>
          ) : (
            <div className={cn('space-y-1')}>
              {label && (
                <Label
                  htmlFor={id}
                  className={cn('text-sm font-medium', labelClassName)}
                  tooltipContent={typeof tooltipContent === 'string' ? tooltipContent : undefined}
                  showTooltip={!!tooltipContent}
                >
                  {label}
                </Label>
              )}
              <div>
                <CustomButton
                  variant="outline"
                  className={cn(
                    'data-[empty=true]:text-muted-foreground flex items-center relative px-2 py-1 h-8 text-xs font-normal gap-1 min-w-0 ',
                    { 'border-destructive': hasError },
                    buttonClassName,
                    className
                  )}
                  type="button"
                >
                  <CalendarIcon className="h-3 w-3 flex-shrink-0" />
                  {displayValue ? displayValue : <span>{placeholder}</span>}
                </CustomButton>
              </div>
              {description && !hasError && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}

              {hasError && (
                <p
                  id={`${id}-error`}
                  className="flex items-center gap-1 text-xs font-medium text-destructive"
                >
                  {errorMessage}
                </p>
              )}
            </div>
          )}
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="center"
          sideOffset={4}
          alignOffset={0}
          collisionPadding={{ left: 16, right: 16, top: 16, bottom: 16 }}
          sticky="partial"
          avoidCollisions={true}
          className={cn(
            'z-50 w-auto p-0 shadow-md border border-border rounded-md',
            popoverClassName
          )}
        >
          {renderCalendar()}
        </PopoverContent>
      </Popover>
    </div>
  );
};
