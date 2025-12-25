export interface Day {
  value: number;
  label: string;
}

export interface DaySelectorProps {
  label?: string;
  labelClassName?: string;
  value: number[];
  onChange: (days: number[]) => void;
  days?: Day[];
  className?: string;
  badgeClassName?: string;
  containerClassName?: string;
  showSelectedCount?: boolean;
  selectedCountText?: string;
  disabled?: boolean;
}

export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
