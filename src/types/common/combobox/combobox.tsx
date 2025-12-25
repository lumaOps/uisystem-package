import type { SelectOption } from '../select/selectCustom';

export interface Option {
  label: string;
  value: string | number;
}

export type ComboboxCustomProps = {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  onChange: (value: SelectOption) => void; // Changed to match your usage
  name?: string;
  disabled?: boolean;
  inputClassName?: string;
  errorMessage?: string;
  value?: string | number; // Changed to SelectOption object
  isMultiple?: boolean;
  tooltipContent?: React.ReactNode;
  type?: string;
};

export const comboboxOptions = [
  { label: 'option1', value: '1' },
  { label: 'option2', value: '2' },
  { label: 'option3', value: '3' },
];
