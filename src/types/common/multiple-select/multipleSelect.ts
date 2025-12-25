import { Control, FieldErrors, FieldValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';

export type SelectOption = {
  value: string | number;
  label: string;
};

export type SelectConfig = {
  name: string;
  label: string;
  placeholder?: string;
  dependsOn?: string[];
  id?: string;
  options?: SelectOption[];
  description?: string;
  tooltipContent?: React.ReactNode;
  errorMessage?: string;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
};

export type MultipleSelectsData = {
  [key: string]:
    | SelectOption[]
    | Record<string, SelectOption[]>
    | Record<string, Record<string, SelectOption[]>>; // year => make => list of models
};
export interface MultipleSelectsProps {
  configs: SelectConfig[];
  data: MultipleSelectsData;
  onChange?: (values: Record<string, string | number>) => void;
  control: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  setValue?: UseFormSetValue<FieldValues>;
  getValues?: (fieldName?: string | string[]) => unknown;
  className?: string;
  watch?: UseFormWatch<FieldValues>;
  type?: string;
  disabled?: boolean;
}
