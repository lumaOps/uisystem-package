import * as React from 'react';
import { cn } from '@/utils/utils';
import {
  CRM_BADGE_COLORS,
  type CrmBadgeColorVariant,
} from '@/modules/crm/types/crm-listing/crmListing';

export interface BadgeStatusColorProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: CrmBadgeColorVariant;
  withBullet?: boolean;
  bulletColor?: string;
  value?: string;
  icon?: React.ReactNode;
  useStyle?: boolean;
}

const BadgeStatusColor = React.memo(
  React.forwardRef<HTMLDivElement, BadgeStatusColorProps>(
    (
      { className, color, withBullet, bulletColor, value, icon, useStyle = true, ...props },
      ref
    ) => (
      <div
        ref={ref}
        className={cn(
          color ? CRM_BADGE_COLORS[color] : '',
          'inline-flex items-center justify-center rounded-3xl border px-2 py-1 text-sm transition-colors text-center w-auto',
          className
        )}
        {...props}
      >
        {withBullet && (
          <span
            className={cn(
              'mr-1.5 inline-block h-2 w-2 rounded-full',
              !useStyle && bulletColor ? `bg-${bulletColor}` : ''
            )}
            style={useStyle && bulletColor ? { backgroundColor: bulletColor } : undefined}
          />
        )}
        {value}
        {icon && <span className="ml-1">{icon}</span>}
      </div>
    )
  )
);

BadgeStatusColor.displayName = 'BadgeStatusColor';

export { BadgeStatusColor };
