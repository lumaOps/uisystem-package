'use client';

import { ToasterProps } from '@/types/common/sonner/sonnerToast';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps as SonnerToasterProps } from 'sonner';

const SonnerToast = ({
  durationValue = '3000',
  titleClassName = '',
  descriptionClassName = '',
  btnActionClassName = '',
  btnCancelClassName = '',
  ...props
}: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  // Handle duration: if it's a string, check for 'infinity' or parse to number
  const resolvedDuration =
    durationValue === 'infinity'
      ? Infinity
      : typeof durationValue === 'string'
        ? parseInt(durationValue, 10)
        : durationValue;

  return (
    <Sonner
      theme={theme as SonnerToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        duration: resolvedDuration,
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg w-[356px]',
          description: 'text-muted-foreground ' + descriptionClassName,
          title: ' ' + titleClassName,
          actionButton: 'btn-default !h-9 ' + btnActionClassName,
          cancelButton:
            '!group-[.toast]:bg-muted !group-[.toast]:text-muted-foreground h-9! w-[96px]! text-center justify-center font-medium! ' +
            btnCancelClassName,
        },
      }}
      {...props}
    />
  );
};

export { SonnerToast };
