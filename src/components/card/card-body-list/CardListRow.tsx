import { CardListRowProps } from '@/types/global-types';
import React from 'react';

/**
 * CardListRow
 * Flexible row layout for list items, supporting up to three sections: left, middle, right.
 *
 * @param {React.ReactNode} left - Content for the left section (optional).
 * @param {React.ReactNode} middle - Content for the middle section (optional).
 * @param {React.ReactNode} right - Content for the right section (optional).
 * @param {string} [className] - Optional extra class for the row.
 *
 * Layout logic:
 * - If all three sections are present: each takes 1/3 of the width.
 * - If two sections: each takes 1/2 of the width.
 * - If only one section: takes full width.
 * - If you provide a className on a section, it overrides the default width.
 * - Only renders sections that are provided (no empty columns).
 * - The right section is always aligned to the right.
 */

type WithClassName = { className?: string };

function getDefaultWidth(count: number) {
  if (count === 3) return 'w-1/3';
  if (count === 2) return 'w-1/2';
  return 'w-full';
}

function renderSection(child: React.ReactNode, fallback: string, extraClass = '') {
  if (!child) return null;
  if (React.isValidElement(child)) {
    if (child.type === React.Fragment) {
      return child;
    }
    const childClass = (child.props as WithClassName).className;
    return React.cloneElement(child as React.ReactElement<WithClassName>, {
      className: childClass
        ? `${childClass} ${extraClass}`.trim()
        : `${fallback} ${extraClass}`.trim(),
    });
  }
  return <div className={`${fallback} ${extraClass}`.trim()}>{child}</div>;
}

const CardListRow: React.FC<CardListRowProps> = ({ left, middle, right, className }) => {
  const count = [left, middle, right].filter(Boolean).length;
  const defaultWidth = getDefaultWidth(count);

  return (
    <div
      className={`flex justify-between items-center gap-3 ${className ? className : 'px-4 py-4'} `}
    >
      {left && renderSection(left, defaultWidth)}
      {middle && renderSection(middle, defaultWidth)}
      {right && renderSection(right, defaultWidth, 'flex justify-end')}
    </div>
  );
};

export default CardListRow;
