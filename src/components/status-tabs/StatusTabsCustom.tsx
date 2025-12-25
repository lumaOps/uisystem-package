'use client';

import React, { useCallback, useMemo } from 'react';
import { cn } from '@/utils/utils';
import type { statusTabsProps } from '@/types/common/status-tabs/statusTabs';
import { CustomButton } from '../button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { Separator } from '@/components/separator/separator';

export function StatusTabsCustom({
  tabs,
  activeTab,
  onTabChange,
  className,
  disabled = false,
}: statusTabsProps) {
  // Memoize tab click handler to prevent recreation
  const t = useCustomTranslation();
  const handleTabClick = useCallback(
    (tabId: string, disabled: boolean) => {
      if (!disabled) {
        onTabChange(tabId);
      }
    },
    [onTabChange]
  );

  // Memoize separator component to prevent recreation
  const separatorElement = useMemo(
    () => <Separator orientation="vertical" className="h-4 border border-border" />,
    []
  );

  // Memoize tabs rendering to prevent recreation on every render
  const renderedTabs = useMemo(() => {
    return tabs.map((tab, index) => {
      const isActive = activeTab == tab.id;
      const isLast = index === tabs.length - 1;
      const isDisabled = tab.disabled || tab.count === 0;

      // Memoize button classes calculation
      const buttonClassName = cn(
        'w-auto sm:w-auto h-8 rounded-lg sm:text-sm text-xs flex items-center justify-center gap-2',
        isActive ? 'text-background  font-semibold' : 'text-muted-foreground font-semibold',
        isDisabled ? 'cursor-not-allowed pointer-events-none' : 'cursor-pointer'
      );

      // Memoize count badge classes
      const countClassName =
        tab.count == 0 || tab.count
          ? cn(
              'min-w-7 h-4 text-xs rounded-full font-normal flex items-center justify-center',
              isActive ? 'bg-background text-primary' : 'bg-muted text-muted-foreground'
            )
          : '';

      return (
        <React.Fragment key={tab.id}>
          {isLast && tabs.length > 1 && separatorElement}

          <CustomButton
            variant={isActive ? 'default' : 'ghost'}
            onClick={() => handleTabClick(tab.id, !!tab.disabled)}
            disabled={isDisabled}
            className={buttonClassName}
          >
            <span>{t(tab.label)}</span>
            <span className={countClassName}>{tab.count}</span>
          </CustomButton>
        </React.Fragment>
      );
    });
  }, [tabs, activeTab, handleTabClick, separatorElement, t]);

  return (
    <div
      className={cn(
        'w-full overflow-x-auto',
        disabled && 'pointer-events-none opacity-60',
        className
      )}
      style={{
        scrollbarWidth: 'none',
      }}
    >
      <div className="flex w-max items-center gap-4">{renderedTabs}</div>
    </div>
  );
}

export default React.memo(StatusTabsCustom);
