'use client';

import * as React from 'react';
import { cn } from '@/utils/utils';

// Remove imports for Label, HelpCircle, AlertCircle, InputPrimitive

export type InputPrimitiveProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputPrimitiveProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Basic styles - no border, no focus ring - add flex, h-full, w-full? Maybe just bg-transparent? Let's keep it minimal.
          'w-full bg-transparent p-0 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 text-foreground',
          // Removed: border, border-input, ring-offset-background, focus-visible:ring-2, focus-visible:ring-ring, focus-visible:ring-offset-2
          // Removed: h-10 (height should be controlled by wrapper), px-3 py-2 (padding controlled by wrapper)
          className // Allow overriding
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input'; // Keep display name simple

export { Input }; // Export the primitive
