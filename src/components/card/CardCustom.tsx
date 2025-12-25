import { Card, CardContent, CardFooter, CardHeader } from '@/components/card/card';
import { CardCustomType } from '@/types/common/card/cardCustom';
import { cn } from '@/utils/utils';
import React from 'react';

export const CardCustom: React.FC<React.PropsWithChildren<CardCustomType>> = ({
  containerClassName,
  children,
  footer,
  header,
  headerClassName,
  contentClassName,
  footerClassName,
}) => {
  return (
    <Card className={cn('w-full border rounded-xl shadow-sm', containerClassName)}>
      {header && <CardHeader className={cn('p-6', headerClassName)}>{header}</CardHeader>}
      {children && <CardContent className={cn('p-4', contentClassName)}>{children}</CardContent>}

      {footer && (
        <CardFooter className={cn('flex justify-end gap-3 p-6 pt-0 border-t-0', footerClassName)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};
CardCustom.displayName = 'CardCustom';
