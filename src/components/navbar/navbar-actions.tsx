'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useNavbarStore } from '@/stores/nav-bar/navbarStore';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { CustomButton } from '@/components/button/CustomButton';

export function NavbarActions() {
  const { actions } = useNavbarStore();
  const router = useRouter();
  const t = useCustomTranslation();

  if (!actions.length) return null;

  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => {
        const handleAction =
          action.action || (action.url ? () => router.push(action.url!) : undefined);

        return (
          <CustomButton
            key={index}
            variant={action.variant}
            onClick={handleAction}
            disabled={action.disabled}
            isLoading={action.isLoading}
            positionIcon={action.positionIcon}
            buttonClassName={action.buttonClassName}
            onBlur={action.onBlur}
            onFocus={action.onFocus}
            onKeyDown={action.onKeyDown}
            onMouseEnter={action.onMouseEnter}
            onMouseLeave={action.onMouseLeave}
          >
            {/* If customContent exists, use it, otherwise use icon + label */}
            {action.customContent || (
              <>
                {action.icon}
                {action.label && t(action.label)}
              </>
            )}
          </CustomButton>
        );
      })}
    </div>
  );
}
