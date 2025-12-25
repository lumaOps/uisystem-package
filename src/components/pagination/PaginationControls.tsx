'use client';

import React from 'react';
import { SelectCustom } from '@/components/select/SelectCustom';
import { PaginationCustom } from '@/components/pagination/PaginationCustom';
import { PaginationControlsProps } from '@/types/global-types';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';

export const PaginationControls = ({
  total,
  perPage,
  currentPage,
  lastPage,
  startItem,
  endItem,
  perPageOptions,
  onPerPageChange,
  onPageChange,
}: PaginationControlsProps) => {
  const t = useCustomTranslation();

  if (!total || total <= 0) return null;

  return (
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <SelectCustom
          id="per-page"
          value={perPage.toString()}
          onValueChange={onPerPageChange}
          options={perPageOptions.map(option => ({
            label: option.toString(),
            value: option.toString(),
          }))}
          className="w-18 h-8 text-foreground font-medium"
        />
        <span className="text-foreground font-medium mt-2">
          {t(`Showing ${startItem} to ${endItem} of ${total}`)}
        </span>
      </div>

      <div className="ml-auto">
        <PaginationCustom
          currentPage={currentPage}
          lastPage={lastPage}
          perPage={perPage}
          total={total}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
