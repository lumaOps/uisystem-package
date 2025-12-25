'use client';

import React, { useCallback } from 'react';
import { TicketPercent } from 'lucide-react';
import { TabsCustom, TabsListCustom, TabsTriggerCustom } from '@/components/tabs/TabsCustom';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { BillingType } from '@/modules/auth/constants/auth';

interface BillingHeaderProps {
  title: string;
  description: string;
  billing: BillingType.MONTHLY | BillingType.YEARLY;
  onBillingChange: (value: BillingType.MONTHLY | BillingType.YEARLY) => void;
  showSavingsText?: boolean;
  className?: string;
}

export default function BillingHeader({
  title,
  description,
  billing,
  onBillingChange,
  showSavingsText = true,
  className = '',
}: BillingHeaderProps) {
  const t = useCustomTranslation();

  const handleBillingChange = useCallback(
    (value: string) => {
      onBillingChange(value as BillingType.MONTHLY | BillingType.YEARLY);
    },
    [onBillingChange]
  );

  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-2xl font-bold mb-2">{t(title)}</h1>
      <p className="text-muted-foreground mb-6">{t(description)}</p>
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-8">
        <TabsCustom value={billing} onValueChange={handleBillingChange} className="w-full md:w-fit">
          <TabsListCustom className="p-1 bg-muted rounded-3xl w-full md:w-fit">
            <TabsTriggerCustom
              value="monthly"
              className="rounded-3xl px-5 py-1.5 text-xs md:text-sm font-medium transition-all"
            >
              {t('Monthly')}
            </TabsTriggerCustom>
            <TabsTriggerCustom
              value="yearly"
              className="rounded-3xl px-5 py-1.5 text-xs md:text-sm font-medium transition-all"
            >
              {t('Yearly')}
            </TabsTriggerCustom>
          </TabsListCustom>
        </TabsCustom>
        {showSavingsText && (
          <span className="ml-0 md:ml-2 text-xs font-semibold text-foreground flex items-center gap-1">
            <TicketPercent size={18} className="me-1" />
            {t('Go annual and get 2 months free')}
          </span>
        )}
      </div>
    </div>
  );
}
