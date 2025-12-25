// file: components/common/skeleton/SkeletonCustom.tsx

import { cn } from '@/utils/utils';
import { SkeletonCustomProps } from '@/types/skeleton/skeleton';

export const SkeletonCustom: React.FC<SkeletonCustomProps> = ({
  count = 1,
  columns,
  rows,
  width = 'w-full',
  height = 'h-4',
  shape,
  className = '',
  ...props
}) => {
  const shapeClass =
    shape === 'circle' ? 'rounded-full' : shape === 'square' ? 'rounded-none' : 'rounded-md';

  if (columns && rows) {
    return (
      <div className="border rounded-lg overflow-hidden shadow-sm">
        {/* Header */}
        <div className={cn(`grid grid-cols-${columns} bg-muted px-4 py-3`)}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`header-${i}`}>
              <div className={cn('animate-pulse bg-primary/10 rounded-md', width, height)} />
            </div>
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className={cn(
              `grid grid-cols-${columns} items-center px-4 py-3 border-t border-border`
            )}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`}>
                <div className={cn('animate-pulse bg-primary/10 rounded-md', width, height)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Inline skeletons
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className={cn('animate-pulse bg-primary/10', shapeClass, width, height, className)}
          {...props}
        />
      ))}
    </>
  );
};
