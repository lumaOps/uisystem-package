import { ReactNode } from 'react';
import { VehicleAgeItem } from '../../modules/inventory/types/analytics/inventoryAnalytics';
import { IconPosition } from '@/components/button/CustomButton';
import { QueryKey } from '@tanstack/react-query';

export interface CardStatisticsProps {
  title: string;
  value: number | string;
  colorClass?: string;
  tooltip?: string;
  icon?: React.ReactNode;
  iconWithBorder?: boolean;
  className?: string;
  titleClassName?: string;
  onSelectCard?: (data: unknown) => void;
}

export interface AvgAnalyticsProps {
  title?: string;
  data: VehicleAgeItem[];
  tooltipText?: string;
  className?: string;
}

export interface AvgAgeChartProps {
  title: string;
  TooltipDescription?: string;
  currentValue: string;
  previousPeriod: string;
  description?: string;
  chart: ReactNode;
}

export interface ImageCheckboxProps {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  imageClassName?: string;
  checkboxClassName?: string;
  className?: string;
}

export interface CardListRowProps {
  left?: React.ReactNode;
  middle?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export interface GlobalCardItem {
  id: string | number;
  icon?: string;
  label?: string;
  avatar?: string;
  name?: string;
  message?: string;
  value?: string | number;
  action?: string | string[];
  button?: boolean;
  overpriced?: boolean;
  responseTime?: string;
  unread?: boolean;
  text?: string | number;
  time?: string;
  count?: number;
}

export interface CardItemProps {
  id: string | number;
  name: string;
  value: string | number;
  icon: string;
  action?: string;
  overpriced?: boolean;
  className?: string;
}
export interface DataCheckCardProps {
  title: string;
  children?: React.ReactNode;
  items?: CardItemProps[];
  separatorClassName?: string;
  className?: string;
  headerSeparator?: boolean;
  withHeader?: boolean;
}

export type ValueOrDashProps = {
  value: React.ReactNode;
  className?: string;
};

export type PaginationControlsProps = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  startItem: number;
  endItem: number;
  perPageOptions: number[];
  onPerPageChange: (value: string) => void;
  onPageChange: (page: number) => void;
};

export interface CarouselImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  objectFit?: React.CSSProperties['objectFit'];
}

export interface VehicleHistoryService {
  id: string;
  value: string;
  src: string;
  alt: string;
}

export interface StatusCardProps {
  srcImage: string;
  message: string;
  messageClassName?: string;
  description?: string;
  buttonText?: string;
  onActivate?: () => void;
  className?: string;
  isLoading?: boolean;
  secondaryButtonText?: string;
  onSecondaryActivate?: () => void;
  secondaryIsLoading?: boolean;
  showBorder?: boolean;
  imageWidth?: number;
  imageHeight?: number;
  loadingText?: string;
  secondaryLoadingText?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  positionIcon?: IconPosition;
  loadingClassName?: string;
}

export interface DateTimeLabelOptions {
  showTime?: boolean;
  showRelative?: boolean;
  timeOnly?: boolean;
}

export interface OptimisticUpdateOptions<TData = unknown> {
  queryKey: QueryKey;
  payload: Record<string, unknown>;
  dataPath?: string;
}

export interface OptimisticUpdateContext<TData = unknown> {
  previousData: TData | undefined;
  queryKey: QueryKey;
}
