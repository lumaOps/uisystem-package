import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';

const BadgeCustomVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-ring text-center hover:opacity-80',
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground ',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface MonBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof BadgeCustomVariants> {}

function BadgeCustom({ className, variant, ...props }: MonBadgeProps) {
  return <div className={cn(BadgeCustomVariants({ variant }), className)} {...props} />;
}

export { BadgeCustom, BadgeCustomVariants };
