'use client';

import Image from 'next/image';
import { cn } from '@/utils/utils';
import { CheckboxCustom } from '@/components/checkbox/CheckboxCustom';
import { ImageCheckboxProps } from '@/types/global-types';

export default function ImageChecked({
  id,
  src,
  alt,
  width = 160,
  height = 120,
  checked = false,
  onCheckedChange,
  imageClassName,
  checkboxClassName,
}: ImageCheckboxProps) {
  const handleClick = () => {
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div
      className={cn(
        'relative flex p-2 items-center justify-center border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer'
      )}
      onClick={handleClick}
    >
      <div className="absolute top-3 left-2 z-10">
        <CheckboxCustom
          id={id}
          checked={checked}
          onCheckedChange={handleClick}
          className={cn('shadow-sm', checkboxClassName)}
        />
      </div>

      <div className="relative mt-3 flex items-center justify-center">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn('object-contain w-auto', imageClassName)}
        />
      </div>
    </div>
  );
}
