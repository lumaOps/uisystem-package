'use client';

import * as React from 'react';
import { type DateRange, DayPicker } from 'react-day-picker';
import { enUS } from 'date-fns/locale';
import {
  startOfMonth,
  addMonths,
  subMonths,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import { cn } from '@/utils/utils';
import { CalendarCustomProps } from '@/types/common/calendar/calendarCustom';
import { SelectOption } from '@/types/common/select/selectCustom';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import DynamicIconLucide from '@/components/dynamic-icon-lucide/DynamicIconLucide';
import { CustomButton } from '@/components/button/CustomButton';
import { SelectCustom } from '@/components/select/SelectCustom';

const CalendarHeader = React.memo(
  ({
    month,
    onPrevious,
    onNext,
    numberOfMonths = 1,
  }: {
    month: Date;
    onPrevious: () => void;
    onNext: () => void;
    numberOfMonths?: 1 | 2;
  }) => {
    const chevronLeft = React.useMemo(
      () => <DynamicIconLucide iconName="ChevronLeft" className="h-5 w-5" />,
      []
    );

    const chevronRight = React.useMemo(
      () => <DynamicIconLucide iconName="ChevronRight" className="h-5 w-5" />,
      []
    );

    const currentMonth = format(month, 'MMMM yyyy', { locale: enUS });
    const nextMonth = format(addMonths(month, 1), 'MMMM yyyy', { locale: enUS });

    return (
      <div className="flex items-center justify-between mb-6 px-2">
        <CustomButton variant={'outline'} onClick={onPrevious} className="h-8 w-8">
          {chevronLeft}
        </CustomButton>
        <div
          className={`flex items-center justify-center text-md font-medium font-sans text-foreground ${numberOfMonths === 2 ? 'gap-8' : ''}`}
        >
          <div className="text-center min-w-[120px]">{currentMonth}</div>
          {numberOfMonths === 2 && <div className="text-center min-w-[120px]">{nextMonth}</div>}
        </div>
        <CustomButton variant={'outline'} onClick={onNext} className="h-8 w-8">
          {chevronRight}
        </CustomButton>
      </div>
    );
  }
);

CalendarHeader.displayName = 'CalendarHeader';

const getCommonClassNames = (numberOfMonths: 1 | 2) => ({
  nav: 'hidden',
  month_caption: 'hidden',
  caption_label: 'hidden',
  months: numberOfMonths === 2 ? 'flex flex-row gap-8' : 'flex flex-col',
  month: 'flex flex-col gap-4',
  month_grid: 'w-full border-collapse space-y-1',
  weekdays: 'flex gap-2 mb-3',
  weekday: 'text-muted-foreground rounded-md w-10 font-normal text-sm text-center',
  week: 'flex w-full gap-2 my-2',
  day: 'flex justify-center item-center h-10 w-10 text-center text-sm relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent rounded-md hover:bg-primary hover:text-primary-foreground',
  day_button:
    'h-10 w-10 text-center text-sm relative focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent rounded-md hover:bg-primary hover:text-primary-foreground p-0',
  selected: 'bg-primary text-primary-foreground hover:bg-primary focus:bg-primary',
  today: 'bg-muted',
  outside: 'text-muted-foreground opacity-50',
  disabled: 'text-muted-foreground opacity-30 cursor-not-allowed',
  range_middle: 'aria-selected:primary',
  hidden: 'invisible',
});

export function CalendarCustom(
  props: CalendarCustomProps & {
    name?: string;
  }
) {
  const {
    className,
    classNames,
    showOutsideDays = true,
    disabled,
    numberOfMonths = 1,
    dateRangeOptions: customDateRangeOptions,
  } = props;

  const [hoveredDate, setHoveredDate] = React.useState<Date | null>(null);

  const t = useCustomTranslation();

  const defaultDateRangeOptions: SelectOption[] = React.useMemo(
    () => [
      { value: 'custom', label: t('Custom Range') },
      { value: 'last7days', label: t('Last 7 Days') },
      { value: 'last30days', label: t('Last 30 Days') },
      { value: 'last3months', label: t('Last 3 Months') },
      { value: 'last6months', label: t('Last 6 Months') },
      { value: 'lastyear', label: t('Last Year') },
      { value: 'thismonth', label: t('This Month') },
      { value: 'thisyear', label: t('This Year') },
    ],
    [t]
  );

  const dateRangeOptions = customDateRangeOptions || defaultDateRangeOptions;

  const detectPresetRange = React.useCallback((currentRange: DateRange | undefined): string => {
    if (!currentRange?.from || !currentRange?.to) return 'custom';

    const today = startOfDay(new Date());
    const from = startOfDay(currentRange.from);
    const to = startOfDay(currentRange.to);

    const isSameDayComparison = (date1: Date, date2: Date) => {
      return date1.getTime() === date2.getTime();
    };

    // Last 7 days
    const last7DaysFrom = startOfDay(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000));
    if (isSameDayComparison(from, last7DaysFrom) && isSameDayComparison(to, today)) {
      return 'last7days';
    }

    // Last 30 days
    const last30DaysFrom = startOfDay(new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000));
    if (isSameDayComparison(from, last30DaysFrom) && isSameDayComparison(to, today)) {
      return 'last30days';
    }

    // Last 3 months
    const last3MonthsFrom = startOfDay(
      new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
    );
    if (isSameDayComparison(from, last3MonthsFrom) && isSameDayComparison(to, today)) {
      return 'last3months';
    }

    // Last 6 months
    const last6MonthsFrom = startOfDay(
      new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())
    );
    if (isSameDayComparison(from, last6MonthsFrom) && isSameDayComparison(to, today)) {
      return 'last6months';
    }

    // Last year
    const lastYearFrom = startOfDay(new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000));
    if (isSameDayComparison(from, lastYearFrom) && isSameDayComparison(to, today)) {
      return 'lastyear';
    }

    // This month
    const thisMonthFrom = startOfDay(new Date(today.getFullYear(), today.getMonth(), 1));
    if (isSameDayComparison(from, thisMonthFrom) && isSameDayComparison(to, today)) {
      return 'thismonth';
    }

    // This year
    const thisYearFrom = startOfDay(new Date(today.getFullYear(), 0, 1));
    if (isSameDayComparison(from, thisYearFrom) && isSameDayComparison(to, today)) {
      return 'thisyear';
    }

    return 'custom';
  }, []);

  const [selectedRange, setSelectedRange] = React.useState<string>(() => {
    if (props.mode === 'range') {
      return detectPresetRange(props.selected as DateRange | undefined);
    }
    return 'custom';
  });

  React.useEffect(() => {
    if (props.mode === 'range') {
      const detectedRange = detectPresetRange(props.selected as DateRange | undefined);
      setSelectedRange(detectedRange);
    }
  }, [props.selected, props.mode, detectPresetRange]);

  const getInitialMonth = () => {
    if (props.mode === 'multiple' && props.selected?.length) {
      return startOfMonth(props.selected[0]);
    } else if (props.mode === 'range' && props.selected?.from) {
      return startOfMonth(props.selected.from);
    } else if (props.mode !== 'multiple' && props.mode !== 'range' && props.selected) {
      return startOfMonth(props.selected);
    }
    return startOfMonth(new Date());
  };

  const [month, setMonth] = React.useState(getInitialMonth);

  const handlePrevious = React.useCallback(() => setMonth(prev => subMonths(prev, 1)), []);
  const handleNext = React.useCallback(() => setMonth(prev => addMonths(prev, 1)), []);

  const handleRangeSelectChange = React.useCallback(
    (value: string) => {
      setSelectedRange(value);

      if (value === 'custom') {
        return;
      }

      const today = startOfDay(new Date());
      let newRange: DateRange = { from: undefined, to: undefined };

      switch (value) {
        case 'last7days':
          newRange = {
            from: startOfDay(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
            to: today,
          };
          break;
        case 'last30days':
          newRange = {
            from: startOfDay(new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000)),
            to: today,
          };
          break;
        case 'last3months':
          newRange = {
            from: startOfDay(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())),
            to: today,
          };
          break;
        case 'last6months':
          newRange = {
            from: startOfDay(new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())),
            to: today,
          };
          break;
        case 'lastyear':
          newRange = {
            from: startOfDay(new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000)),
            to: today,
          };
          break;
        case 'thismonth':
          newRange = {
            from: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)),
            to: today,
          };
          break;
        case 'thisyear':
          newRange = {
            from: startOfDay(new Date(today.getFullYear(), 0, 1)),
            to: today,
          };
          break;
        default:
          return;
      }

      // Vérifier si les dates sont désactivées
      const isDisabled = (date: Date) => {
        if (typeof disabled === 'function') {
          return disabled(date);
        }
        if (Array.isArray(disabled)) {
          return disabled.some(matcher => {
            if (typeof matcher === 'function') {
              return matcher(date);
            }
            return false;
          });
        }
        return false;
      };

      if (newRange.from && isDisabled(newRange.from)) {
        console.warn('Range start date is disabled');
        setSelectedRange('custom');
        return;
      }
      if (newRange.to && isDisabled(newRange.to)) {
        console.warn('Range end date is disabled');
        setSelectedRange('custom');
        return;
      }

      if (props.onSelect) {
        (props.onSelect as (range: DateRange | undefined) => void)(newRange);
      }
    },
    [props.onSelect, disabled]
  );

  const handleRangeSelect = React.useCallback(
    (range: DateRange | undefined) => {
      if (!props.onSelect) return;

      const currentSelection = props.selected as DateRange | undefined;

      const isFullRangeSelected =
        currentSelection?.from &&
        currentSelection?.to &&
        currentSelection.from.getTime() !== currentSelection.to.getTime();

      if (isFullRangeSelected && range?.to) {
        (props.onSelect as (range: DateRange | undefined) => void)(undefined);
        setHoveredDate(null);
        setSelectedRange('custom');
      } else {
        (props.onSelect as (range: DateRange | undefined) => void)(range);

        if (range?.from && range?.to) {
          const detectedRange = detectPresetRange(range);
          setSelectedRange(detectedRange);
        }

        if (range?.to) {
          setHoveredDate(null);
        }
      }
    },
    [props.selected, props.onSelect, detectPresetRange]
  );

  const handleDayMouseEnter = React.useCallback(
    (date: Date) => {
      if (props.mode === 'range') {
        const currentSelection = props.selected as DateRange | undefined;
        if (currentSelection?.from === currentSelection?.to) {
          setHoveredDate(date);
        }
      }
    },
    [props.mode, props.selected]
  );

  const handleDayMouseLeave = React.useCallback(() => {
    if (props.mode === 'range') {
      setHoveredDate(null);
    }
  }, [props.mode]);

  const modifiers = React.useMemo(() => {
    const mods: Record<string, (date: Date) => boolean> = {};

    if (props.mode === 'range' && hoveredDate) {
      const currentSelection = props.selected as DateRange | undefined;
      const fromDate = currentSelection?.from;
      const toDate = currentSelection?.to;

      if (fromDate && fromDate === toDate) {
        mods.hoverRange = (date: Date) => {
          const start = isBefore(fromDate, hoveredDate) ? fromDate : hoveredDate;
          const end = isAfter(fromDate, hoveredDate) ? fromDate : hoveredDate;

          return isWithinInterval(date, { start, end }) && !isSameDay(date, fromDate);
        };
      }
    }
    return mods;
  }, [props.mode, props.selected, hoveredDate]);

  const modifiersClassNames = React.useMemo(
    () => ({
      hoverRange: 'bg-primary/20 text-primary hover:bg-primary/30',
    }),
    []
  );

  const mergedClassNames = React.useMemo(
    () => ({
      ...getCommonClassNames(numberOfMonths),
      ...classNames,
    }),
    [classNames, numberOfMonths]
  );

  const dayPickerCommonProps = React.useMemo(
    () => ({
      month,
      onMonthChange: setMonth,
      numberOfMonths,
      showOutsideDays,
      locale: enUS,
      disabled,
      className: 'flex justify-center',
      classNames: mergedClassNames,
      modifiers,
      modifiersClassNames,
      onDayMouseEnter: handleDayMouseEnter,
      onDayMouseLeave: handleDayMouseLeave,
    }),
    [
      month,
      numberOfMonths,
      showOutsideDays,
      disabled,
      mergedClassNames,
      modifiers,
      modifiersClassNames,
      handleDayMouseEnter,
      handleDayMouseLeave,
    ]
  );

  const renderDayPicker = React.useMemo(() => {
    if (!props.mode || props.mode === 'single') {
      return (
        <DayPicker
          mode="single"
          selected={props.selected as Date | undefined}
          onSelect={props.onSelect as (date: Date | undefined) => void}
          {...dayPickerCommonProps}
        />
      );
    }

    if (props.mode === 'multiple') {
      return (
        <DayPicker
          mode="multiple"
          selected={props.selected as Date[] | undefined}
          onSelect={props.onSelect as (dates: Date[] | undefined) => void}
          {...dayPickerCommonProps}
        />
      );
    }

    if (props.mode === 'range') {
      return (
        <DayPicker
          mode="range"
          selected={props.selected as { from: Date; to?: Date } | undefined}
          onSelect={handleRangeSelect}
          {...dayPickerCommonProps}
        />
      );
    }

    return null;
  }, [props.mode, props.selected, props.onSelect, dayPickerCommonProps, handleRangeSelect]);

  return (
    <div className={cn('p-4 rounded-md w-100', className)}>
      {props.mode === 'range' && (
        <div className="mx-2 my-4">
          <SelectCustom
            id="calendar-range-select"
            options={dateRangeOptions}
            value={selectedRange}
            onValueChange={handleRangeSelectChange}
            placeholder="Select date range"
            className="w-full"
            triggerClassName="w-full"
          />
        </div>
      )}

      <CalendarHeader
        month={month}
        onPrevious={handlePrevious}
        onNext={handleNext}
        numberOfMonths={numberOfMonths}
      />
      {renderDayPicker}
    </div>
  );
}

export default React.memo(CalendarCustom);
