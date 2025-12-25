'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { CustomButton } from '../button/CustomButton';
import DropdownMenuCustom from '../dropdown-menu/DropdownMenuCustom';
import { ActionsCustomProps } from '@/types/common/actions/actionsCustom';

const ActionsCustom: React.FC<ActionsCustomProps> = ({
  actionOptions,
  onActionChange,
  buttonText = 'Actions',
  menuWidth = 'w-50',
  align = 'start',
  triggerType = 'click',
  className = '',
  isDisabled = false,
}) => {
  return (
    <div className={className}>
      <DropdownMenuCustom
        disabled={isDisabled}
        list_menu={actionOptions}
        menuWidth={menuWidth}
        onSelectionChange={value => onActionChange(value as string)}
        itemType="default"
        align={align}
        triggerType={triggerType}
        customTrigger={
          <CustomButton
            variant="outline"
            className="flex items-center gap-2 h-10"
            icon={<ChevronDown size={18} />}
            positionIcon="right"
          >
            {buttonText}
          </CustomButton>
        }
      />
    </div>
  );
};

export default ActionsCustom;
