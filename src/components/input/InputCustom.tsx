'use client';

import * as React from 'react';
import { Input } from './Input';
import { Label } from '@/components/label/Label';
import { cn } from '@/utils/utils';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { InputCustomProps } from '@/types/common/input/input';
import DynamicIconLucide from '../dynamic-icon-lucide/DynamicIconLucide';
import { formatNumberWithCommas, getRawNumericValue } from '@/utils/helpers/helperFunctions';
import { PasswordCriteriaDisplay } from '@/components/otp-input/PasswordCriteria';

const maxWidthClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
} as const;

const InputCustom = React.forwardRef<HTMLInputElement, InputCustomProps>(
  (
    {
      label,
      description,
      tooltipContent,
      errorMessage,
      startIcon,
      endIcon,
      className,
      labelClassName,
      containerClassName,
      inputClassName,
      startIconClassName,
      endIconClassName,
      InputDisabledClassName,
      id,
      name,
      type = 'text',
      maxWidth = 'full',
      value,
      onChange,
      showpasswordcriteria = false,
      ...props
    },
    ref
  ) => {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState<string>('');
    const [criteriaVisible, setCriteriaVisible] = React.useState(false);
    const hasError = !!errorMessage;
    const isPasswordType = type === 'password';
    const isNumberType = type === 'number';
    const currentInputType = isPasswordType
      ? passwordVisible
        ? 'text'
        : 'password'
      : isNumberType
        ? 'text'
        : type;

    // Initialize display value for number inputs
    React.useEffect(() => {
      if (isNumberType && value !== undefined) {
        const stringValue = String(value);
        setDisplayValue(formatNumberWithCommas(stringValue));
      }
    }, [value, isNumberType]);

    const togglePasswordVisibility = () => {
      if (isPasswordType) {
        setPasswordVisible(!passwordVisible);
      }
    };

    const shouldShowPasswordCriteria = isPasswordType && showpasswordcriteria;

    React.useEffect(() => {
      if (shouldShowPasswordCriteria && value) {
        setCriteriaVisible(true);
      } else if (shouldShowPasswordCriteria && !value) {
        setCriteriaVisible(false);
      }
    }, [value, shouldShowPasswordCriteria]);

    const handlePasswordFocus = () => {
      if (shouldShowPasswordCriteria) {
        setCriteriaVisible(true);
      }
    };

    const handlePasswordBlur = () => {
      if (shouldShowPasswordCriteria) {
        setTimeout(() => setCriteriaVisible(false), 150);
      }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (isNumberType) {
        // Remove all non-digit characters except decimal point and minus sign
        // Also prevent multiple decimal points
        let cleanValue = inputValue.replace(/[^\d.-]/g, '');

        // Handle multiple decimal points - keep only the first one
        const decimalIndex = cleanValue.indexOf('.');
        if (decimalIndex !== -1) {
          const beforeDecimal = cleanValue.substring(0, decimalIndex + 1);
          const afterDecimal = cleanValue.substring(decimalIndex + 1).replace(/\./g, '');
          cleanValue = beforeDecimal + afterDecimal;
        }

        // Format the display value
        const formatted = formatNumberWithCommas(cleanValue);
        setDisplayValue(formatted);

        // Get raw numeric value for the onChange handler
        const rawValue = getRawNumericValue(formatted);

        // Create a new event with the raw value
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: rawValue,
          },
        };

        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      } else {
        onChange?.(e);
      }
    };

    const renderIcon = (
      icon: React.ReactNode | string,
      wrapperClassName?: string,
      onClick?: () => void,
      isFunctionalIcon?: boolean
    ) => {
      if (!icon) return null;

      let iconElement: React.ReactNode;

      if (React.isValidElement(icon)) {
        iconElement = React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: cn(
            'h-4 w-4 shrink-0',
            hasError && !isFunctionalIcon ? 'text-destructive' : 'text-muted-foreground',
            'group-hover:text-primary',
            'group-focus-within:text-primary',
            'group-disabled:opacity-50',
            onClick ? 'cursor-pointer' : ''
          ),
        });
      } else if (typeof icon === 'string') {
        iconElement = (
          <DynamicIconLucide
            className={cn(
              'h-4 w-4 shrink-0',
              hasError && !isFunctionalIcon ? 'text-destructive' : 'text-muted-foreground',
              'group-hover:text-primary',
              'group-focus-within:text-primary',
              'group-disabled:opacity-50',
              onClick ? 'cursor-pointer' : ''
            )}
            iconName={icon}
          />
        );
      } else {
        // fallback, just render as-is
        iconElement = icon;
      }

      return (
        <div className={cn('flex items-center justify-center', wrapperClassName)} onClick={onClick}>
          {iconElement}
        </div>
      );
    };

    const ErrorIcon = () => (
      <div className="flex items-center justify-center">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
      </div>
    );

    let effectiveEndIcon = endIcon;
    let endIconOnClick: (() => void) | undefined = undefined;
    let isEndIconFunctional = false;

    if (isPasswordType) {
      effectiveEndIcon = passwordVisible ? <EyeOff /> : <Eye />;
      endIconOnClick = togglePasswordVisibility;
      isEndIconFunctional = true;
    }

    // Determine the input value to display
    const inputValue = isNumberType ? displayValue : value;

    return (
      <div className={cn('space-y-1', className)}>
        {label && (
          <Label
            htmlFor={id}
            className={cn('text-sm font-medium', labelClassName)}
            tooltipContent={typeof tooltipContent === 'string' ? tooltipContent : undefined}
            showTooltip={!!tooltipContent}
          >
            {label}
          </Label>
        )}
        <div
          className={cn(
            'group flex h-10 items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:border-primary',
            'shadow-sm hover:shadow-base',
            'has-disabled:cursor-not-allowed has-disabled:opacity-50',
            { 'border-destructive': hasError },
            maxWidthClasses[maxWidth],
            containerClassName
          )}
        >
          {hasError && !isPasswordType ? (
            <ErrorIcon />
          ) : (
            renderIcon(startIcon, startIconClassName, undefined, false)
          )}
          <Input
            ref={ref}
            id={id}
            name={name}
            type={currentInputType}
            value={inputValue}
            onChange={handleNumberChange}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            className={cn(
              'flex-1 w-full h-full border-0 bg-transparent py-0 text-sm shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0',
              inputClassName,
              InputDisabledClassName
            )}
            {...props}
          />
          {renderIcon(effectiveEndIcon, endIconClassName, endIconOnClick, isEndIconFunctional)}
        </div>
        {description && !hasError && <p className="text-xs text-muted-foreground">{description}</p>}
        {hasError && (
          <p
            id={`${id}-error`}
            className="flex items-center gap-1 text-xs font-medium text-destructive"
          >
            {errorMessage}
          </p>
        )}
        {shouldShowPasswordCriteria && (
          <PasswordCriteriaDisplay
            passwordValue={typeof value === 'string' ? value : ''}
            showCriteria={criteriaVisible}
            className="mt-2"
          />
        )}
      </div>
    );
  }
);

InputCustom.displayName = 'InputCustom';

export { InputCustom };
