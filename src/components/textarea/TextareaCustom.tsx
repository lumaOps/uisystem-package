import * as React from 'react';
import { cn } from '@/utils/utils';
import { Label } from '../label/Label';

interface TextareaCustomProps extends React.ComponentProps<'textarea'> {
  label?: string;
  labelClassName?: string;
  tooltipContent?: string;
  errorMessage?: string;
  description?: string;
}

function TextareaCustom({
  className,
  label,
  labelClassName,
  errorMessage,
  ...props
}: TextareaCustomProps) {
  const hasError = !!errorMessage;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label
          htmlFor={props.id}
          className={cn('text-sm font-medium', labelClassName)}
          tooltipContent={
            typeof props.tooltipContent === 'string' ? props.tooltipContent : undefined
          }
          showTooltip={!!props.tooltipContent}
        >
          {label}
        </Label>
      )}
      <textarea
        data-slot="textarea"
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
          { 'border-destructive': hasError }
        )}
        {...props}
      />
      {props.description && !hasError && (
        <p className="text-xs text-muted-foreground">{props.description}</p>
      )}

      {hasError && (
        <p
          id={`${props.id}-error`}
          className="flex items-center gap-1 text-xs font-medium text-destructive"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export { TextareaCustom };
