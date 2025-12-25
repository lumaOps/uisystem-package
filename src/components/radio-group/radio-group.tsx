'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Check } from 'lucide-react';

import { cn } from '@/utils/utils';

// Types pour supporter string, number et boolean
type RadioGroupValue = string | number | boolean;

interface RadioGroupProps extends Omit<
  React.ComponentProps<typeof RadioGroupPrimitive.Root>,
  'value' | 'defaultValue' | 'onValueChange'
> {
  value?: RadioGroupValue;
  defaultValue?: RadioGroupValue;
  onValueChange?: (value: RadioGroupValue) => void;
}

interface RadioGroupItemProps extends Omit<
  React.ComponentProps<typeof RadioGroupPrimitive.Item>,
  'value'
> {
  value: RadioGroupValue;
}

function RadioGroup({ className, value, defaultValue, onValueChange, ...props }: RadioGroupProps) {
  // Convertir les valeurs en string pour Radix UI
  const stringValue = value !== undefined ? String(value) : undefined;
  const stringDefaultValue = defaultValue !== undefined ? String(defaultValue) : undefined;

  // Fonction pour reconvertir la valeur string en type original
  const convertValue = (stringVal: string): RadioGroupValue => {
    // Vérifier si c'est un boolean
    if (stringVal === 'true') return true;
    if (stringVal === 'false') return false;

    // Vérifier si c'est un number
    const numberVal = Number(stringVal);
    if (!isNaN(numberVal) && stringVal !== '') {
      return numberVal;
    }

    // Sinon, retourner comme string
    return stringVal;
  };

  const handleValueChange = (stringVal: string) => {
    if (onValueChange) {
      const convertedValue = convertValue(stringVal);
      onValueChange(convertedValue);
    }
  };

  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('grid gap-3', className)}
      value={stringValue ?? ''}
      defaultValue={stringDefaultValue ?? ''}
      onValueChange={handleValueChange}
      {...props}
    />
  );
}

function RadioGroupItem({ className, value, ...props }: RadioGroupItemProps) {
  // Convertir la valeur en string pour Radix UI
  const stringValue = String(value);

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'aspect-square size-5 shrink-0 rounded-full border border-primary text-primary ring-offset-background',
        'transition-colors shadow-xs outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary-gradient data-[state=checked]:text-background',
        className
      )}
      value={stringValue}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
export type { RadioGroupValue, RadioGroupProps, RadioGroupItemProps };
