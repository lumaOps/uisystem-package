'use client';

import { Globe } from 'lucide-react';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/dropdown-menu/DropdownMenu';
import { CustomButton } from '@/components/button/CustomButton';
import { cn } from '@/utils/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type LocaleOption = 'en' | 'fr' | 'es';

export function LocaleSwitcher() {
  const t = useCustomTranslation();
  const [currentLocale, setCurrentLocale] = useState<LocaleOption>('en');
  const router = useRouter();

  // Read cookie on client
  useEffect(() => {
    const match = document.cookie.match(/NEXT_LOCALE=(en|fr|es)/);
    setCurrentLocale(match ? (match[1] as LocaleOption) : 'en');
  }, []);

  const handleLocaleChange = (locale: LocaleOption) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    setCurrentLocale(locale);
    router.refresh();
  };
  const locales: { label: string; value: LocaleOption; icon: string }[] = [
    { label: t('English'), value: 'en', icon: '🇺🇸' },
    { label: t('French'), value: 'fr', icon: '🇫🇷' },
    { label: t('Spanish'), value: 'es', icon: '🇪🇸' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomButton variant="outline" size="sm" className="flex items-center gap-2 h-9">
          <Globe className="w-4 h-4" />
        </CustomButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {locales.map(locale => (
          <DropdownMenuItem
            key={locale.value}
            onClick={() => handleLocaleChange(locale.value as LocaleOption)}
            className={cn(
              'flex items-center justify-between',
              locale.value === currentLocale ? 'bg-muted' : ''
            )}
          >
            <div className="flex items-center gap-2">
              {locale.icon}
              <span>{locale.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
