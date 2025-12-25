import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import React, { useState } from 'react';
import { BadgeCustom } from '@/components/badge/BadgeCustom';

function SubNavMenu({
  items,
  onClick,
  activeIndex: controlledActiveIndex,
  setActiveIndex: setControlledActiveIndex,
}: {
  items: (string | { label: string; badge?: string | number })[];
  onClick?: (item: string) => void;
  activeIndex?: number; // optional controlled active index
  setActiveIndex?: (index: number) => void; // optional controlled setter
}) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const t = useCustomTranslation();

  // Use controlled if provided, else internal
  const activeIndex = controlledActiveIndex ?? internalActiveIndex;
  const setActiveIndex = setControlledActiveIndex ?? setInternalActiveIndex;

  const handleClick = (item: string, index: number) => {
    setActiveIndex(index);
    if (onClick) {
      onClick(item);
    }
  };

  const getItemLabel = (item: string | { label: string; badge?: string | number }): string => {
    return typeof item === 'string' ? item : item.label;
  };

  const getItemBadge = (
    item: string | { label: string; badge?: string | number }
  ): string | number | undefined => {
    return typeof item === 'string' ? undefined : item.badge;
  };

  return (
    <div className="overflow-x-auto mb-5">
      <div className="flex space-x-4 whitespace-nowrap">
        {items.map((item, index) => {
          const label = getItemLabel(item);
          const badge = getItemBadge(item);

          return (
            <span
              key={index}
              className={`cursor-pointer text-muted-foreground text-sm h-9 hover:text-primary flex items-center gap-2 ${
                index === activeIndex ? 'text-primary border-b-2 border-primary' : ''
              }`}
              onClick={() => handleClick(label, index)}
            >
              {t(label)}
              {badge !== undefined && (
                <BadgeCustom variant="primary" className="text-xs px-2 rounded-full py-0.5">
                  {badge}
                </BadgeCustom>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default SubNavMenu;
