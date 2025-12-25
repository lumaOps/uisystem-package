import * as React from 'react';
import { SelectProps } from '@radix-ui/react-select'; // Assuming SelectProps might be needed from Radix

// Define the structure for select options
export interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// Define the props for the SelectCustom component
export interface SelectCustomProps extends SelectProps {
  id: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  tooltipContent?: React.ReactNode;
  errorMessage?: string;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  containerClassName?: string;
  itemClassName?: string;
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}
