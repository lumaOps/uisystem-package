import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/utils';
import { Loader2 } from 'lucide-react';
import DynamicIconLucide from '../dynamic-icon-lucide/DynamicIconLucide';

const customButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'btn-default',
        destructive: 'btn-destructive',
        outline: 'btn-outline',
        secondary: 'btn-secondary',
        ghost: 'btn-ghost',
        link: 'btn-link',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      iconSpacing: {
        true: 'gap-3',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      iconSpacing: false,
    },
  }
);

// Position options for the icon
export type IconPosition = 'left' | 'right' | 'both' | 'none';

export interface CustomButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof customButtonVariants>, 'iconSpacing'> {
  asChild?: boolean;
  icon?: React.ReactNode | string;
  positionIcon?: IconPosition;
  isLoading?: boolean;
  buttonClassName?: string;
  iconClassName?: string;
  loaderClassName?: string;
  action?: () => void;

  // Extended event handlers
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseMove?: React.MouseEventHandler<HTMLButtonElement>;
  onTouchStart?: React.TouchEventHandler<HTMLButtonElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLButtonElement>;
  onTouchMove?: React.TouchEventHandler<HTMLButtonElement>;
  onTouchCancel?: React.TouchEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLButtonElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  onContextMenu?: React.MouseEventHandler<HTMLButtonElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLButtonElement>;
  onDrag?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnd?: React.DragEventHandler<HTMLButtonElement>;
  onDragEnter?: React.DragEventHandler<HTMLButtonElement>;
  onDragExit?: React.DragEventHandler<HTMLButtonElement>;
  onDragLeave?: React.DragEventHandler<HTMLButtonElement>;
  onDragOver?: React.DragEventHandler<HTMLButtonElement>;
  onDragStart?: React.DragEventHandler<HTMLButtonElement>;
  onDrop?: React.DragEventHandler<HTMLButtonElement>;
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      positionIcon = 'left',
      isLoading,
      fullWidth,
      buttonClassName,
      iconClassName,
      loaderClassName,
      action,
      onClick,
      // We don't need to destructure other event handlers as they'll be passed via ...props
      ...props
    },
    ref
  ) => {
    // Determine if icons should be shown based on position
    const showLeftIcon = icon && (positionIcon === 'left' || positionIcon === 'both');
    const showRightIcon = icon && (positionIcon === 'right' || positionIcon === 'both');

    // Determine if we need icon spacing (automatically)
    const needsIconSpacing = !!(((showLeftIcon || showRightIcon) && icon) || isLoading);

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          customButtonVariants({
            variant,
            size,
            fullWidth,
            iconSpacing: needsIconSpacing,
          }),
          buttonClassName,
          className
        )}
        ref={ref}
        disabled={props.disabled || isLoading}
        // Inline the event handler to avoid the issue
        onClick={event => {
          if (action) action();
          if (onClick) onClick(event);
        }}
        {...props}
      >
        {isLoading ? (
          <Loader2 className={cn('animate-spin', loaderClassName)} />
        ) : (
          showLeftIcon && (
            <span className={cn('flex items-center', iconClassName)}>
              {typeof icon === 'string' ? <DynamicIconLucide iconName={icon} /> : <>{icon}</>}
            </span>
          )
        )}
        {props.children}
        {showRightIcon && !isLoading && (
          <span className={cn('flex items-center', iconClassName)}>
            {typeof icon === 'string' ? <DynamicIconLucide iconName={icon} /> : <>{icon}</>}
          </span>
        )}
      </Comp>
    );
  }
);
CustomButton.displayName = 'CustomButton';

export { CustomButton, customButtonVariants };
