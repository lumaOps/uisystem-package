'use client';

import * as React from 'react';
import {
  format,
  parseISO,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/utils/utils';
import DynamicIconLucide from '../dynamic-icon-lucide/DynamicIconLucide';
import { CustomButton } from '../button/CustomButton';
import { SelectCustom } from '../select/SelectCustom';
import { SelectOption } from '@/types/common/select/selectCustom';
import { InputCustom } from '../input/InputCustom';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/Popover';
import { Label } from '../label/Label';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

// Types for the API data structure
interface TimeSlot {
  start: string;
  end: string;
  agent_ids: number[];
}

export interface DateAvailability {
  date: string;
  hours: TimeSlot[];
}

interface DateTimePickerProps {
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  onDateTimeSelect?: ({ date, timeSlot }: { date: string; timeSlot: TimeSlot }) => void;
  selectedDate?: string;
  selectedTimeSlot?: TimeSlot;
  availabilityData?: DateAvailability[];
  disabled?: boolean;
  name?: string;
  id?: string;
  containerClassName?: string;
  errorMessage?: string;
}

// Quick date options
const createQuickDateOptions = (t: (key: string) => string): SelectOption[] => [
  { value: 'today', label: t('Today') },
  { value: 'tomorrow', label: t('Tomorrow') },
  { value: 'next-week', label: t('Next Week') },
  { value: 'next-month', label: t('Next Month') },
];

export function DateTimePicker({
  className,
  buttonClassName = '',
  popoverClassName = '',
  label = '',
  labelClassName = '',
  placeholder,
  onDateTimeSelect,
  selectedDate,
  selectedTimeSlot,
  availabilityData = [],
  disabled = false,
  containerClassName,
  errorMessage,
  id,
}: DateTimePickerProps) {
  const t = useCustomTranslation();
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDateState, setSelectedDateState] = React.useState<string | null>(
    selectedDate || null
  );
  const [selectedTimeSlotState, setSelectedTimeSlotState] = React.useState<TimeSlot | null>(
    selectedTimeSlot || null
  );
  const [quickDateSelection, setQuickDateSelection] = React.useState<string>('');
  const [timeSearch, setTimeSearch] = React.useState<string>('');

  // Get current month's dates
  const monthDates = React.useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Handle date selection
  const handleDateSelect = React.useCallback(
    (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const availability = availabilityData.find(item => item.date === dateString);

      if (availability && availability.hours.length > 0) {
        setSelectedDateState(dateString);
        setSelectedTimeSlotState(null); // Reset time selection when date changes
      }
    },
    [availabilityData]
  );

  // Handle time slot selection
  const handleTimeSlotSelect = React.useCallback(
    (timeSlot: TimeSlot) => {
      if (selectedDateState) {
        setSelectedTimeSlotState(timeSlot);
        onDateTimeSelect?.({ date: selectedDateState, timeSlot: timeSlot });

        setOpen(false); // Close dropdown after selection
      }
    },
    [selectedDateState, onDateTimeSelect]
  );

  // Handle quick date selection
  const handleQuickDateSelect = React.useCallback(
    (value: string) => {
      setQuickDateSelection(value);

      let targetDate: Date;
      const today = new Date();

      switch (value) {
        case 'today':
          targetDate = today;
          break;
        case 'tomorrow':
          targetDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          break;
        case 'next-week':
          targetDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'next-month':
          targetDate = addMonths(today, 1);
          break;
        default:
          return;
      }

      setCurrentMonth(targetDate);
      handleDateSelect(targetDate);
    },
    [handleDateSelect]
  );

  // Navigation handlers
  const handlePreviousMonth = React.useCallback(() => {
    setCurrentMonth(prev => subMonths(prev, 1));
  }, []);

  const handleNextMonth = React.useCallback(() => {
    setCurrentMonth(prev => addMonths(prev, 1));
  }, []);

  // Check if date has availability
  const hasAvailability = React.useCallback(
    (date: Date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      const availability = availabilityData.find(item => item.date === dateString);
      return availability && availability.hours.length > 0;
    },
    [availabilityData]
  );

  // Get selected date availability
  const selectedDateAvailability = React.useMemo(() => {
    if (!selectedDateState) return null;
    return availabilityData.find(item => item.date === selectedDateState);
  }, [selectedDateState, availabilityData]);

  // Filter time slots based on search
  const filteredTimeSlots = React.useMemo(() => {
    if (!selectedDateAvailability) return [];

    if (!timeSearch) return selectedDateAvailability.hours;

    return selectedDateAvailability.hours.filter(slot =>
      slot.start.toLowerCase().includes(timeSearch.toLowerCase())
    );
  }, [selectedDateAvailability, timeSearch]);

  // Display value for the button
  const displayValue = React.useMemo(() => {
    if (selectedDateState && selectedTimeSlotState) {
      const date = parseISO(selectedDateState);
      const formattedDate = format(date, 'dd MMM yyyy');
      return `${formattedDate}, ${selectedTimeSlotState.start}`;
    }
    return '';
  }, [selectedDateState, selectedTimeSlotState]);

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={cn('space-y-1')}>
            {label && (
              <Label htmlFor={id} className={cn('text-sm font-medium', labelClassName)}>
                {label}
              </Label>
            )}
            <div>
              <CustomButton
                variant="outline"
                disabled={disabled}
                className={cn(
                  'data-[empty=true]:text-muted-foreground flex items-center relative px-2 py-1 h-8 text-xs font-normal gap-1 min-w-0',
                  buttonClassName,
                  className,
                  containerClassName
                )}
                type="button"
              >
                <DynamicIconLucide iconName="Calendar" className="h-3 w-3 flex-shrink-0" />
                {displayValue ? displayValue : <span>{placeholder}</span>}
              </CustomButton>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={4}
          alignOffset={0}
          collisionPadding={{ left: 16, right: 16, top: 16, bottom: 16 }}
          sticky="partial"
          avoidCollisions={true}
          className={cn(
            'z-50 w-[480px] p-3 shadow-md border border-border rounded-md',
            popoverClassName
          )}
        >
          {/* Quick Date Selection */}
          <div className="mb-3">
            <SelectCustom
              id="quick-date-select"
              options={createQuickDateOptions(t)}
              value={quickDateSelection}
              onValueChange={handleQuickDateSelect}
              placeholder={t('Tomorrow')}
              className="w-full"
              triggerClassName="w-full h-8 text-xs"
            />
          </div>

          <div className="flex gap-3">
            {/* Date Picker - Left Side */}
            <div className="flex-1">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-3">
                <CustomButton
                  variant="ghost"
                  size="icon"
                  onClick={handlePreviousMonth}
                  disabled={disabled}
                  className={cn('h-6 w-6', containerClassName)}
                >
                  <DynamicIconLucide iconName="ChevronLeft" className="h-3 w-3" />
                </CustomButton>

                <h3 className="text-sm font-medium text-foreground">
                  {format(currentMonth, 'MMM yyyy', { locale: enUS })}
                </h3>

                <CustomButton
                  variant="ghost"
                  size="icon"
                  onClick={handleNextMonth}
                  disabled={disabled}
                  className="h-6 w-6"
                >
                  <DynamicIconLucide iconName="ChevronRight" className="h-3 w-3" />
                </CustomButton>
              </div>

              {/* Calendar Grid */}
              <div className="space-y-1">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div
                      key={day}
                      className="h-6 flex items-center justify-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar dates */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDates.map((date, index) => {
                    const dateString = format(date, 'yyyy-MM-dd');
                    const isSelected = selectedDateState === dateString;
                    const hasAvail = hasAvailability(date);
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    const isTodayDate = isToday(date);

                    return (
                      <button
                        key={index}
                        onClick={() => hasAvail && handleDateSelect(date)}
                        disabled={!hasAvail || disabled}
                        className={cn(
                          'h-6 w-6 rounded text-xs font-medium transition-colors',
                          'flex items-center justify-center',
                          {
                            'text-muted-foreground cursor-not-allowed':
                              !hasAvail || !isCurrentMonth,
                            'text-foreground hover:bg-muted':
                              hasAvail && isCurrentMonth && !isSelected && !isTodayDate,
                            'bg-primary text-primary-foreground': isSelected,
                            'bg-muted text-foreground':
                              hasAvail && !isSelected && isCurrentMonth && isTodayDate,
                            'text-foreground':
                              hasAvail && !isSelected && isCurrentMonth && !isTodayDate,
                          }
                        )}
                      >
                        {format(date, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Picker - Right Side */}
            <div className="w-36 border-l pl-3">
              {/* Time Search */}
              <div className="mb-2">
                <InputCustom
                  id="time-search"
                  placeholder={t('Search time...')}
                  value={timeSearch}
                  onChange={e => setTimeSearch(e.target.value)}
                  className="w-full h-8 text-xs"
                />
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {selectedDateAvailability ? (
                  filteredTimeSlots.length > 0 ? (
                    filteredTimeSlots.map((timeSlot, index) => {
                      const isSelected = selectedTimeSlotState?.start === timeSlot.start;

                      return (
                        <button
                          key={index}
                          onClick={() => handleTimeSlotSelect(timeSlot)}
                          disabled={disabled}
                          className={cn(
                            'w-full p-1.5 text-left rounded text-xs transition-colors',
                            {
                              'text-foreground hover:bg-muted': !isSelected,
                              'bg-primary text-primary-foreground': isSelected,
                              'cursor-pointer': !disabled,
                              'cursor-not-allowed opacity-50': disabled,
                            }
                          )}
                        >
                          {timeSlot.start}
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-xs text-muted-foreground">{t('No times available')}</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-muted-foreground">
                      {selectedDateState ? t('No times available') : t('Select a date')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {errorMessage && <p className="text-xs font-medium text-destructive">{errorMessage}</p>}
    </div>
  );
}
