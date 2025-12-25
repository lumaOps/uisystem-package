import { TimeSelectorProps } from '@/types/common/time-selector/time-selector';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { CustomButton } from '../button/CustomButton';
import { convertTo12HourFormat } from '@/utils/helpers/helperFunctions';

export default function TimeSelector({
  startHour = 8,
  endHour = 20,
  interval = 30,
  title = '',
  selectedTime: externalSelectedTime = '',
  onTimeSelected,
}: TimeSelectorProps) {
  const [selectedTime, setSelectedTime] = useState(externalSelectedTime);

  // Synchronize internal state with external prop
  useEffect(() => {
    setSelectedTime(externalSelectedTime);
  }, [externalSelectedTime]);

  // Generate time slots dynamically with configurable intervals using useMemo
  const timeSlots = useMemo(() => {
    const slots: { value: string; display: string }[] = [];
    const startMinutes = startHour * 60;
    const endMinutes = endHour * 60;

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += interval) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      if (hours > endHour || (hours === endHour && mins > 0)) {
        break;
      }

      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      const displayString = convertTo12HourFormat(timeString);

      slots.push({
        value: timeString,
        display: displayString,
      });
    }

    return slots;
  }, [startHour, endHour, interval]);

  // Handle card selection with useCallback to prevent unnecessary re-renders
  const handleSelectTime = useCallback(
    (time: string): void => {
      setSelectedTime(time);
      onTimeSelected?.(time);
    },
    [onTimeSelected]
  );

  // Memoize time buttons to prevent recreation on every render
  const timeButtons = useMemo(() => {
    return timeSlots.map(({ value, display }) => {
      const isSelected = selectedTime === value;
      const buttonClassName = `border rounded-md mb-2 cursor-pointer transition-colors font-medium w-full h-10 font-medium ${
        isSelected
          ? 'border-primary bg-muted hover:border-primary text-primary'
          : 'border-input hover:border-primary'
      }`;

      return (
        <div key={value}>
          <CustomButton
            variant={'outline'}
            onClick={() => handleSelectTime(value)}
            className={buttonClassName}
          >
            {display}
          </CustomButton>
        </div>
      );
    });
  }, [timeSlots, selectedTime, handleSelectTime]);

  // Memoize title element
  const titleElement = useMemo(() => {
    return title ? (
      <h2 className="text-md text-muted-foreground opacity-80 mb-4">{title}</h2>
    ) : null;
  }, [title]);

  // Memoize container styles
  const containerStyles = useMemo(
    () => ({
      scrollbarWidth: 'none' as const,
      msOverflowStyle: 'none' as const,
    }),
    []
  );

  return (
    <div>
      {titleElement}
      <div className="space-y-2 max-h-120 overflow-y-auto pr-1" style={containerStyles}>
        {timeButtons}
      </div>
    </div>
  );
}
