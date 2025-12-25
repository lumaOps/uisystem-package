import { SelectOption } from '@/types/common/multiple-select/multipleSelect';
import { DateRange, Matcher } from 'react-day-picker';

// Props de base communes
export interface CalendarBaseProps {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
  disabled?: Matcher | Matcher[];
  numberOfMonths?: 1 | 2;
  dateRangeOptions?: SelectOption[];
}

// Props pour mode single
export interface CalendarSingleProps extends CalendarBaseProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

// Props pour mode multipled
export interface CalendarMultipleProps extends CalendarBaseProps {
  mode: 'multiple';
  selected?: Date[];
  onSelect?: (dates: Date[] | undefined) => void;
}

// Props pour mode range
export interface CalendarRangeProps extends CalendarBaseProps {
  mode: 'range';
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

export type CalendarCustomProps = CalendarSingleProps | CalendarMultipleProps | CalendarRangeProps;
