'use client';

import { useMemo } from 'react';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { BadgeCustom } from '../badge/BadgeCustom';
import { CustomButton } from '../button/CustomButton';
import { ActiveFiltersComponentGlobalProps } from '@/types/common/active-filter/activeFilterCustom';
import { useCustomTranslation } from '@/hooks/translation/useCustomTranslation';
import {
  formatNumberWithCommas,
  getCurrencySymbol,
  getReadableDateTimeLabel,
} from '@/utils/helpers/helperFunctions';

export default function ActiveFilterCustom({
  activeFilters,
  onClearAll,
  onFilterRemove,
  className = '',
}: ActiveFiltersComponentGlobalProps) {
  const t = useCustomTranslation();
  const currencySign = getCurrencySymbol();

  const filterBadges = useMemo(() => {
    return activeFilters.map((filter, index) => {
      const isPrice = filter.categoryId === 'price';

      if (filter.type === 'sort') {
        return (
          <BadgeCustom
            key={`${filter.categoryId}-sort-${index}`}
            variant="outline"
            className="flex items-center gap-2 border border-status-gray-background"
          >
            <span className="text-sm leading-normal font-medium flex items-center gap-1">
              {filter.sortDirection === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : filter.sortDirection === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : null}
              {filter.categoryLabel}
            </span>

            {onFilterRemove && (
              <X
                className="h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={() => onFilterRemove(filter.categoryId, undefined, 'sort')}
              />
            )}
          </BadgeCustom>
        );
      }

      // For filters:
      if (filter.type === 'filter') {
        // Single option filters
        if (filter.operator === 'in') {
          return (
            <BadgeCustom
              key={`${filter.categoryId}-${filter.optionId}`}
              variant="outline"
              className="flex items-center gap-2 border border-status-gray-background"
            >
              <span className="text-sm leading-normal font-medium">{filter.optionLabel}</span>
              {onFilterRemove && (
                <X
                  className="h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => onFilterRemove(filter.categoryId, filter.optionId)}
                />
              )}
            </BadgeCustom>
          );
        }

        if (filter.operator === 'between') {
          // Range or single value filters

          const options = filter.options;
          let min = '';
          let max = '';

          if (Array.isArray(options)) [min, max] = options;
          else if (typeof options === 'string') min = options;

          return (
            <BadgeCustom
              key={`${filter.categoryId}-range-${index}`}
              variant="outline"
              className="flex items-center gap-2 border border-status-gray-background"
            >
              <span className="text-sm leading-normal font-medium">
                {filter.categoryLabel}:{' '}
                {(() => {
                  switch (filter.numericOperator) {
                    case '=':
                      return (
                        <>
                          <span className="text-muted-foreground">{t('Equal to')}</span>{' '}
                          {`${formatNumberWithCommas(min)}${isPrice ? currencySign : ''}`}
                        </>
                      );
                    case '>=':
                      return (
                        <>
                          <span className="text-muted-foreground">{t('More than')}</span>{' '}
                          {`${formatNumberWithCommas(min)}${isPrice ? currencySign : ''}`}
                        </>
                      );
                    case '<=':
                      return (
                        <>
                          <span className="text-muted-foreground">{t('Less than')}</span>{' '}
                          {`${formatNumberWithCommas(min)}${isPrice ? currencySign : ''}`}
                        </>
                      );
                    case 'between':
                    default:
                      return `${formatNumberWithCommas(min)}${isPrice ? currencySign : ''} - ${formatNumberWithCommas(max)}${isPrice ? currencySign : ''}`;
                  }
                })()}
              </span>
              {onFilterRemove && (
                <X
                  className="h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => onFilterRemove(filter.categoryId)}
                />
              )}
            </BadgeCustom>
          );
        }

        if (filter.operator === 'dates_range') {
          const options = filter.options;
          let min = '';
          let max = '';

          if (Array.isArray(options)) [min, max] = options;
          else if (typeof options === 'string') min = options;

          return (
            <BadgeCustom
              key={`${filter.categoryId}-range-${index}`}
              variant="outline"
              className="flex items-center gap-2 border border-status-gray-background"
            >
              <span className="text-sm leading-normal font-medium">
                {filter.categoryLabel}:{' '}
                {(() => {
                  switch (filter.numericOperator) {
                    case '=':
                      return (
                        <>
                          <span className="text-muted-foreground">{t('Equal to')}</span>{' '}
                          {getReadableDateTimeLabel(min, { showTime: false })}
                        </>
                      );
                    case '>=':
                      return (
                        <>
                          <span className="text-muted-foreground">{t('Starting from')}</span>{' '}
                          {getReadableDateTimeLabel(min, { showTime: false })}
                        </>
                      );
                    case '<=':
                      return (
                        <>
                          <span className="text-muted-foreground">{t('Ending on')}</span>{' '}
                          {getReadableDateTimeLabel(min, { showTime: false })}
                        </>
                      );
                    case 'between':
                    default:
                      return `${getReadableDateTimeLabel(min, { showTime: false })} - ${getReadableDateTimeLabel(max, { showTime: false })}`;
                  }
                })()}
              </span>
              {onFilterRemove && (
                <X
                  className="h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => onFilterRemove(filter.categoryId)}
                />
              )}
            </BadgeCustom>
          );
        }
      }

      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilters]);

  if (activeFilters.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {filterBadges}
      <CustomButton
        variant="secondary"
        size="sm"
        onClick={onClearAll}
        className="text-secondary-foreground text-sm font-medium"
      >
        {t('Clear all')}
      </CustomButton>
    </div>
  );
}
