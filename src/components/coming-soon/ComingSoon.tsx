import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import React from 'react';

type ComingSoonProps = {
  message: string;
};
export default function ComingSoon({ message }: ComingSoonProps) {
  const t = useCustomTranslation();
  return (
    <div className="flex h-full items-center justify-center rounded-lg border p-6 text-center shadow-sm bg-background">
      <div>
        <h2 className="text-xl font-semibold text-primary">{t('Coming Soon')}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t(message)}</p>
      </div>
    </div>
  );
}
