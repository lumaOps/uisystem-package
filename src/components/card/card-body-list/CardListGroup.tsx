import React from 'react';
import { Separator } from '@/components/separator/separator';

/**
 * CardListGroup
 * Generic list group component for rendering a list of items with separators.
 *
 * @template T - The type of each item in the list. Must have a unique 'id' (string or number).
 * @param {T[]} data - The array of items to render.
 * @param {(item: T, idx: number) => React.ReactNode} renderItem - Function to render each item.
 * @param {string} [className] - Optional extra class for the container.
 * @param {string} [separatorClassName] - Optional extra class for the separator.
 * @param {string} [emptyMessage] - Optional custom message when data is empty.
 *
 * - If data is empty, displays a fallback message.
 * - Renders a separator between each item.
 * - Each item must have a unique 'id' property.
 */
interface CardListGroupProps<T extends { id: string | number; className?: string | undefined }> {
  data: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  className?: string;
  separatorClassName?: string;
  emptyMessage?: string;
}

function CardListGroup<T extends { id: string | number; className?: string | undefined }>({
  data,
  renderItem,
  className,
  separatorClassName,
  emptyMessage = 'No items to display',
}: CardListGroupProps<T>) {
  if (!data?.length) {
    return (
      <div
        className={`flex items-center justify-center py-8 text-muted-foreground ${className ?? ''}`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className}>
      {data.map((item, idx) => (
        <React.Fragment key={item.id}>
          <div className={item?.className}>
            {renderItem(item, idx)}
            {idx < data.length - 1 && <Separator className={separatorClassName} />}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default CardListGroup;
