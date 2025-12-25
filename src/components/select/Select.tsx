'use client';

import * as React from 'react';
import * as SelectPrimitiveRadix from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/utils/utils';

// Renaming exports to match the filename convention
const Select = SelectPrimitiveRadix.Root;

const SelectGroup = SelectPrimitiveRadix.Group;

const SelectValue = SelectPrimitiveRadix.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveRadix.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveRadix.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitiveRadix.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background  focus:outline-hidden focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitiveRadix.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitiveRadix.Icon>
  </SelectPrimitiveRadix.Trigger>
));
SelectTrigger.displayName = SelectPrimitiveRadix.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveRadix.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveRadix.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitiveRadix.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitiveRadix.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitiveRadix.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveRadix.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveRadix.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitiveRadix.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitiveRadix.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitiveRadix.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveRadix.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveRadix.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitiveRadix.Portal>
    <SelectPrimitiveRadix.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitiveRadix.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)'
        )}
      >
        {children}
      </SelectPrimitiveRadix.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitiveRadix.Content>
  </SelectPrimitiveRadix.Portal>
));
SelectContent.displayName = SelectPrimitiveRadix.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveRadix.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveRadix.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitiveRadix.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitiveRadix.Label.displayName;
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveRadix.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveRadix.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitiveRadix.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitiveRadix.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitiveRadix.ItemIndicator>
    </span>
    <SelectPrimitiveRadix.ItemText>{children}</SelectPrimitiveRadix.ItemText>
  </SelectPrimitiveRadix.Item>
));
SelectItem.displayName = SelectPrimitiveRadix.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveRadix.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveRadix.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitiveRadix.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitiveRadix.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
