'use client';

import * as React from 'react';

import { Input } from './Input';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { AlertCircle, CreditCard } from 'lucide-react';

// Helper function to format the credit card number
const formatCreditCard = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');
  const matches = cleaned.match(/(\d{1,4})/g);
  return matches ? matches.join(' ') : '';
};

// Helper function to determine card type (very basic)
const getCardType = (value: string): string | null => {
  const cleaned = value.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'diners';
  if (/^35/.test(cleaned)) return 'jcb';
  return null;
};

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

const InputCreditCard = React.forwardRef<HTMLInputElement, CreditCardInputProps>(
  (
    {
      label,
      value = '',
      onChange,
      errorMessage,
      tooltipContent,
      required,
      disabled,
      className,
      labelClassName,
      inputClassName,
      containerClassName,
      id,
      name,
      maxLength = 19,
      ...props
    },
    ref
  ) => {
    const [cardType, setCardType] = React.useState<string | null>(() => getCardType(value));
    const [imageError, setImageError] = React.useState(false);

    // Update card type when external value changes
    React.useEffect(() => {
      setCardType(getCardType(value));
    }, [value]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;
      const formattedValue = formatCreditCard(rawValue);

      // Update card type based on current input
      setCardType(getCardType(formattedValue));

      // Prevent exceeding formatted length limit
      if (formattedValue.length <= maxLength) {
        // Emit the formatted value for external validation
        if (onChange) {
          onChange(formattedValue);
        }
      }
    };

    // Determine error state solely based on errorMessage prop
    const hasError = !!errorMessage;

    // Skip the Next.js Image component in the story and render Lucide icons instead
    const isStorybook = typeof window !== 'undefined' && window.location.href.includes('storybook');

    const StartIcon = () => {
      if (isStorybook || imageError) {
        return <CreditCard className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />;
      }

      return cardType ? (
        <Image
          src={`/assets/bank-cards/${cardType}.svg`}
          alt={`${cardType} card icon`}
          width={20}
          height={20}
          className="mr-2 shrink-0"
          onError={e => {
            setImageError(true);
            (e.target as HTMLImageElement).src = '/assets/bank-cards/default.svg';
            (e.target as HTMLImageElement).alt = 'Default card icon';
          }}
        />
      ) : (
        <Image
          src={'/assets/bank-cards/default.svg'}
          alt={'Default card icon'}
          width={20}
          height={20}
          className="mr-2 shrink-0"
          onError={() => setImageError(true)}
        />
      );
    };

    const EndIcon = () => {
      if (isStorybook || imageError) {
        return <CreditCard className="h-4 w-4 ml-2 text-muted-foreground shrink-0" />;
      }

      return (
        <Image
          src={'/assets/bank-cards/default.svg'}
          alt={'Default card icon'}
          width={20}
          height={20}
          className="ml-2 shrink-0"
          onError={() => setImageError(true)}
        />
      );
    };

    return (
      <div className={cn('space-y-1', className)}>
        {label && (
          <Label
            htmlFor={id}
            className={cn('flex items-center', labelClassName)}
            tooltipContent={tooltipContent}
            showTooltip={!!tooltipContent}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div
          className={cn(
            'flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus-within:outline-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            { 'border-destructive ring-destructive focus-within:ring-destructive': hasError },
            { 'cursor-not-allowed opacity-50': disabled },
            containerClassName
          )}
        >
          {/* Icon at start: Card type or default */}
          <StartIcon />

          <Input
            ref={ref}
            id={id}
            name={name}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            value={value} // Bind directly to the formatted value prop
            onChange={handleInputChange}
            maxLength={maxLength}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={errorMessage ? `${id}-error` : undefined}
            className={cn(
              'flex-1 w-full border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0', // Added flex-1
              { 'text-destructive placeholder:text-destructive/50': hasError },
              inputClassName
            )}
            {...props}
          />

          {/* Icon at end */}
          <EndIcon />
        </div>
        {/* Display error message if passed */}
        {errorMessage && (
          <p
            id={`${id}-error`}
            className="flex items-center gap-1 text-xs font-medium text-destructive mt-1"
          >
            <AlertCircle className="h-3 w-3" />
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

InputCreditCard.displayName = 'InputCreditCard';

export { InputCreditCard };
