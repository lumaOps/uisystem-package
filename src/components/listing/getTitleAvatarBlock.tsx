import React from 'react';
import { getInitials, truncateText } from '@/utils/helpers/helperFunctions';
import { cn } from '@/utils/utils';
import { AvatarBlockProps } from '@/modules/crm/types/crm-listing/crmListing';

export const GetTitleAvatarBlock = ({ full_name, secondary, className }: AvatarBlockProps) => {
  return (
    <div className="cursor-pointer">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'h-9 w-9 rounded-full border border-border text-muted-foreground flex items-center justify-center text-sm font-medium',
            className
          )}
        >
          {getInitials(full_name, 2)}
        </div>

        <div className="flex flex-col leading-tight">
          <span>{truncateText(full_name, 20)}</span>

          {secondary && <span className="text-xs text-muted-foreground">{secondary}</span>}
        </div>
      </div>
    </div>
  );
};
