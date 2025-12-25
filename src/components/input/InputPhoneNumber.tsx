'use client';
import * as React from 'react';
import { Label } from '../label/Label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/Popover';
import { ScrollArea } from '../scroll-area/ScrollArea';
import { cn } from '@/utils/utils';
import { Button } from '@/components/button/button';
import { PhoneInputProps } from '@/types/common/input/input';
import DynamicIconLucide from '../dynamic-icon-lucide/DynamicIconLucide';
import { Input } from './Input';
import {
  cleanPhoneNumber,
  formatPhoneNumber,
  getPhoneMaskByCountryCode,
  PHONE_COUNTRIES,
} from '@/config/phone/phoneConfig';

const InputPhoneNumber: React.FC<PhoneInputProps> = ({
  label,
  description,
  errorMessage,
  tooltipContent,
  value = '',
  onChange,
  className,
  containerClassName,
  inputClassName,
  labelClassName,
  disabled,
  id,
  name,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const findInitialCountry = () => {
    const matched = PHONE_COUNTRIES.find(c => value.startsWith(c.code));
    return matched || PHONE_COUNTRIES[0];
  };
  const [country, setCountry] = React.useState(findInitialCountry());
  const hasError = !!errorMessage;
  const [, setIsDeleting] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const prevValueRef = React.useRef(value);

  React.useEffect(() => {
    const newCountry = findInitialCountry();
    if (newCountry.code !== country.code) {
      setCountry(newCountry);
    }
    prevValueRef.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const cursorPosition = event.target.selectionStart || 0;
    const isBackspaceOrDelete = prevValueRef.current.length > rawValue.length;

    // Determine if user is deleting the country code
    const isAtCountryCode = cursorPosition <= country.code.length;

    // Allow empty value
    if (rawValue === '') {
      onChange?.('');
      return;
    }

    // Clean and format the input value
    let cleanedValue = cleanPhoneNumber(rawValue);

    // Handle special case when user is deleting country code
    if (isBackspaceOrDelete && isAtCountryCode) {
      if (cleanedValue.length < country.code.length) {
        onChange?.(country.code);
        return;
      }
    }

    // Ensure value starts with country code
    if (!cleanedValue.startsWith('+')) {
      cleanedValue = country.code + cleanedValue;
    } else if (!PHONE_COUNTRIES.some(c => cleanedValue.startsWith(c.code))) {
      cleanedValue = country.code + cleanedValue.substring(1);
    }

    // Format the number part (after country code)
    const numberPart = cleanedValue.slice(country.code.length);
    const mask = getPhoneMaskByCountryCode(country.code);
    const formattedNumber = formatPhoneNumber(numberPart, mask);

    // Combine country code with formatted number
    const finalValue = country.code + (formattedNumber ? ' ' + formattedNumber : '');

    onChange?.(finalValue);
  };

  const handleCountrySelect = (selectedCountry: (typeof PHONE_COUNTRIES)[number]) => {
    setCountry(selectedCountry);
    setOpen(false);
    if (onChange) {
      // Get the part after the country code (or the whole value if no country code is found)
      const numberPart = cleanPhoneNumber(value.replace(/^\+\d+\s*/, ''));
      const mask = getPhoneMaskByCountryCode(selectedCountry.code);
      const formattedNumber = formatPhoneNumber(numberPart, mask);
      onChange(selectedCountry.code + (formattedNumber ? ' ' + formattedNumber : ''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      setIsDeleting(true);
    }
  };

  const handleKeyUp = () => {
    setIsDeleting(false);
  };

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn('text-sm font-medium text-foreground', labelClassName)}
          tooltipContent={typeof tooltipContent === 'string' ? tooltipContent : undefined}
          showTooltip={!!tooltipContent}
        >
          {label}
        </Label>
      )}
      <div
        className={cn(
          'flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
          'focus-within:outline-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          'has-disabled:cursor-not-allowed has-disabled:opacity-50',
          { 'border-destructive ring-destructive focus-within:ring-destructive': hasError },
          containerClassName
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              className={cn(
                'h-auto shrink-0 gap-1 px-0 py-0 text-sm ring-offset-0 focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0',
                hasError && 'text-destructive'
              )}
              disabled={disabled}
              aria-label="Select country code"
            >
              <span>{country.flag}</span>
              <DynamicIconLucide
                iconName="ChevronDown"
                className={cn('h-4 w-4 shrink-0 opacity-50', hasError && 'text-destructive')}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-0">
            <ScrollArea className="h-72">
              <ul>
                {PHONE_COUNTRIES.map(c => (
                  <li
                    key={c.code + c.name}
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                    onClick={() => handleCountrySelect(c)}
                    role="option"
                    aria-selected={country.code === c.code}
                  >
                    <span>{c.flag}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="ml-auto text-muted-foreground">{c.code}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        <div className="h-4 w-px bg-border" />
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type="tel"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          placeholder={`${country.code} ${getPhoneMaskByCountryCode(country.code)}`}
          className={cn(
            'h-full flex-1 border-0 bg-transparent p-0 text-sm shadow-none ring-offset-0 focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0',
            { 'text-destructive placeholder:text-destructive/50': hasError },
            inputClassName
          )}
          disabled={disabled}
          {...props}
        />
      </div>
      {description && !hasError && <p className="text-xs text-muted-foreground">{description}</p>}
      {hasError && (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1 text-xs font-medium text-destructive"
        >
          <DynamicIconLucide iconName="AlertCircle" className="h-3 w-3" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

InputPhoneNumber.displayName = 'InputPhoneNumber';

export { InputPhoneNumber };
