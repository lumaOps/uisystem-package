'use client';
import { SlidersHorizontal } from 'lucide-react';
import { CustomButton } from '../button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { FilterProps } from '@/types/common/filter/filterCustom';

export default function FilterCustom({ isOpen, onToggle, activeCount }: FilterProps) {
  const t = useCustomTranslation();
  return (
    <CustomButton
      variant="outline"
      className={`flex items-center gap-2 h-10 ${isOpen ? 'bg-accent' : ''}`}
      onClick={onToggle}
    >
      <SlidersHorizontal className="h-4 w-4" />
      {t('Filters')}
      {activeCount > 0 && (
        <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5">
          {activeCount}
        </span>
      )}
    </CustomButton>
  );
}
