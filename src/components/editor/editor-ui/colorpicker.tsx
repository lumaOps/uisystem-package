import * as React from 'react';

import { HexColorPicker } from 'react-colorful';
import { CustomButton } from '@/components/button/CustomButton';
import { InputCustom } from '@/components/input/InputCustom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover/Popover';

type Props = {
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
};

export default function ColorPicker({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  onChange,
  icon,
  label,
  ...rest
}: Props) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild disabled={disabled}>
        <CustomButton size={'sm'} variant={'outline'} className="h-8 w-8" {...rest}>
          <span className="size-4 rounded-full">{icon}</span>
          {/* <ChevronDownIcon className='size-4'/> */}
        </CustomButton>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <HexColorPicker color={color} onChange={color => onChange?.(color, false)} />
        <InputCustom
          id="color-picker-id"
          maxLength={7}
          onChange={e => {
            e.stopPropagation();
            onChange?.(e?.currentTarget?.value, false);
          }}
          value={color}
        />
      </PopoverContent>
    </Popover>
  );
}
