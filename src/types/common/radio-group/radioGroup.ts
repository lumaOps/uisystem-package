import { RadioGroupValue } from '@/components/radio-group/radio-group';

export interface RadioOption<T extends RadioGroupValue = RadioGroupValue> {
  label: React.ReactNode;
  value: T;
  disabled?: boolean;
  description?: string;
  tooltipContent?: string;
}

export interface RadioGroupCustomProps<T extends RadioGroupValue = RadioGroupValue> {
  data?: RadioOption<T>[];
  name?: string;
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: RadioGroupValue) => void;
  itemClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  radioClassName?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  description?: string;
  label?: React.ReactNode;
  tooltipContent?: string;
}
