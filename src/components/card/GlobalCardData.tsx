'use client';

import { CardCustom } from '@/components/card/CardCustom';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { DataCheckCardProps } from '@/types/global-types';

export function GlobalCardData({
  title,
  children,
  headerSeparator = true,
  withHeader = true,
}: DataCheckCardProps) {
  const t = useCustomTranslation();

  return (
    <CardCustom
      header={
        withHeader ? (
          <h2 className="font-semibold text-sm text-foreground">{t(title)}</h2>
        ) : undefined
      }
      headerClassName={
        withHeader
          ? `flex items-start justify-center px-4 py-0 h-14 rounded-t-lg ${
              headerSeparator ? 'bg-muted/50 border-b' : ''
            }`
          : undefined
      }
      contentClassName="p-0"
      containerClassName="w-full"
    >
      {children}
    </CardCustom>
  );
}
