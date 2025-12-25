export interface MultiSelectOption {
  value: string;
  label: string;
}
export interface MultiSelectCustomProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxSelected?: number;
  searchPlaceholder?: string;
  emptyMessage?: string;
  id?: string;
  name?: string;
  searchable?: boolean;
}
