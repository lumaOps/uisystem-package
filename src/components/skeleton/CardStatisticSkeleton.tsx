import React from 'react';
import { cn } from '@/utils/utils';
import { SkeletonCustom } from '@/components/skeleton/SkeletonCustom';

interface CardStatisticsSkeletonProps {
  count?: number;
  className?: string;
  cardClassName?: string;
  showGrid?: boolean;
}

// Individual card skeleton based on SkeletonCustom
const CardStatisticSkeleton = ({ className = '' }: CardStatisticsSkeletonProps) => {
  return (
    <div
      className={cn(
        'relative bg-forground rounded-lg border border-muted-200 p-6 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex">
          <SkeletonCustom width="w-10" height="h-10" />
        </div>
        <div className="flex-1">
          {/* Skeleton for the title */}
          <SkeletonCustom width="w-28" height="h-4" className="mb-3" />

          {/* Skeleton for the value */}
          <SkeletonCustom width="w-20" height="h-8" className="mb-2" />
        </div>
      </div>
    </div>
  );
};

// Main skeleton for CardStatisticsCrm
const CardStatisticsSkeleton: React.FC<CardStatisticsSkeletonProps> = ({
  count = 4,
  className = '',
  cardClassName = '',
  showGrid = true,
}) => {
  const skeletonCards = Array.from({ length: count }, (_, index) => (
    <div key={index} className="relative">
      <CardStatisticSkeleton className={cardClassName} />
    </div>
  ));

  if (!showGrid) {
    return <>{skeletonCards}</>;
  }

  return (
    <div
      className={cn(
        'grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]',
        className
      )}
    >
      {skeletonCards}
    </div>
  );
};

export default CardStatisticsSkeleton;
export { CardStatisticSkeleton };
