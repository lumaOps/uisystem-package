'use client';
import { Filter } from 'lucide-react';
import { CustomButton } from '../button/CustomButton';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import { SortProps } from '@/types/common/sort/sortCustom';

export default function SortCustom({ isOpen, onToggle, activeCount }: SortProps) {
  const t = useCustomTranslation();

  return (
    <CustomButton
      variant="outline"
      className={`flex items-center gap-2 h-10 ${isOpen ? '' : ''}`}
      onClick={onToggle}
    >
      <Filter className="h-4 w-4" />
      {t('Sort')}
      {activeCount > 0 && (
        <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5">
          {activeCount}
        </span>
      )}
    </CustomButton>
  );
}
