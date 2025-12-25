'use client';

import { Minus, Plus } from 'lucide-react';
import { CustomButton } from '@/components/button/CustomButton';
import { cn } from '@/utils/utils';

interface NumberInputProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export function NumberInput({
  value,
  onValueChange,
  min = 0,
  max = 999,
  step = 1,
  className,
  disabled = false,
}: NumberInputProps) {
  const handleIncrement = () => {
    if (!disabled && value < max) {
      onValueChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (!disabled && value > min) {
      onValueChange(value - step);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onValueChange(newValue);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center border rounded-lg bg-muted/50 w-40',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Decrement Button */}
      <CustomButton
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="h-10 w-10 rounded-l-lg rounded-r-none border-r hover:bg-muted"
      >
        <Minus className="h-4 w-4" />
      </CustomButton>

      {/* Number Display */}
      <div className="flex-1 px-3 py-2 text-center">
        <input
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full text-center bg-transparent border-none outline-none text-foreground font-medium"
        />
      </div>

      {/* Increment Button */}
      <CustomButton
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="h-10 w-10 rounded-r-lg rounded-l-none border-l hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
      </CustomButton>
    </div>
  );
}
