import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';

const badgeStatusCustomVariants = cva(
  ' inline-flex items-center justify-center rounded-3xl border px-2 py-1 text-sm transition-colors text-center w-auto',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-status-blue-background text-status-blue-foreground hover:opacity-100',
        gray: 'border-transparent bg-status-gray-background text-status-gray-foreground hover:opacity-100',
        blue: 'border-transparent bg-status-blue-background text-status-blue-foreground hover:opacity-100',
        yellow:
          'border-transparent bg-status-yellow-background text-status-yellow-foreground hover:opacity-100',
        green:
          'border-transparent bg-status-green-background text-status-green-foreground hover:opacity-100',
        red: 'border-transparent bg-status-red-background text-status-red-foreground hover:opacity-100',
        orange: 'border-transparent bg-chart-4 text-chart-4-500 hover:opacity-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeStatusCustomVariants> {
  withBullet?: boolean;
}

function BadgeStatusCustom({
  className,
  variant,
  withBullet = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <div className={cn(badgeStatusCustomVariants({ variant }), className)} {...props}>
      {withBullet && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </div>
  );
}

export { BadgeStatusCustom, badgeStatusCustomVariants };
