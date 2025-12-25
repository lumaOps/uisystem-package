export interface OtpInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  numInputs?: number;
  description?: string;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  containerClassName?: string; // Applied to the root OTPInput container
  slotClassName?: string; // Applied to each slot div
  name?: string;
  id: string;
}
