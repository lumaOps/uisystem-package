import * as React from 'react';
import { Checkbox } from '@/components/checkbox/Checkbox';

// Define props based on the Primitive's props + custom ones
export interface CheckboxCustomProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Checkbox>,
  'onChange' | 'id'
> {
  label?: React.ReactNode;
  description?: string;
  errorMessage?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
  id: string;
  tooltipContent?: string;
}
