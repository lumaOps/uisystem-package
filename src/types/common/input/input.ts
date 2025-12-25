import * as React from 'react';

// --- InputCustom --- //
export interface InputCustomProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'prefix' | 'suffix' | 'id'
> {
  label?: string;
  description?: string;
  tooltipContent?: React.ReactNode;
  errorMessage?: string;
  startIcon?: React.ReactNode | string;
  endIcon?: React.ReactNode | string;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  startIconClassName?: string;
  endIconClassName?: string;
  InputDisabledClassName?: string;
  maxWidth?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | 'full';
  id: string;
  showpasswordcriteria?: boolean;
}

// --- InputPhoneNumber --- //
export interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'id'
> {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  description?: string;
  errorMessage?: string;
  tooltipContent?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  id: string;
}

// --- InputCreditCard --- //
export interface CreditCardInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value' | 'id'
> {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
  tooltipContent?: string;
  required?: boolean;
  disabled?: boolean;
  labelClassName?: string;
  inputClassName?: string;
  containerClassName?: string;
  id: string;
  name?: string;
}
