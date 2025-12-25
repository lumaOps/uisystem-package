import { CalendarBaseProps } from '@/types/common/calendar/calendarCustom';
import { DateRange } from 'react-day-picker';

export interface CustomDatePickerBaseProps extends CalendarBaseProps {
  placeholder?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  calendarClassName?: string;
  minDate?: Date;
  maxDate?: Date;
}

export interface CustomDatePickerSingleProps extends CustomDatePickerBaseProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export interface CustomDatePickerMultipleProps extends CustomDatePickerBaseProps {
  mode: 'multiple';
  selected?: Date[];
  onSelect?: (dates: Date[] | undefined) => void;
}

export interface CustomDatePickerRangeProps extends CustomDatePickerBaseProps {
  mode: 'range';
  selected?: DateRange;
  onSelect?: (range: DateRange) => void;
}

export type CustomDatePickerProps =
  | CustomDatePickerSingleProps
  | CustomDatePickerMultipleProps
  | CustomDatePickerRangeProps;
