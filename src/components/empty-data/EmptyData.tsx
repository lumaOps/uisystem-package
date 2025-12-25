import React from 'react';
import { CustomButton } from '@/components/button/CustomButton';
import Image from 'next/image';
import { CardCustom } from '@/components/card/CardCustom';
import { CustomButtonVariant } from '@/types/common/button/buttonCustom';
import { cn } from '@/utils/utils';

export interface EmptyDataProps {
  imageUrl?: string;
  headerOne?: string;
  headerTwo?: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: string;
  buttonVariant?: string;
  onButtonClick?: () => void;
  localImage?: string;
  className?: string;
}

function EmptyData({
  imageUrl,
  localImage,
  headerOne,
  headerTwo,
  description,
  buttonText,
  buttonIcon,
  onButtonClick,
  buttonVariant,
  className,
}: EmptyDataProps) {
  return (
    <CardCustom
      containerClassName={cn('flex', className)}
      contentClassName="flex flex-col gap-2 items-center justify-center w-full"
    >
      {(localImage || imageUrl) && (
        <Image
          src={
            localImage
              ? `${localImage}`
              : `${process.env.NEXT_PUBLIC_CDN_IMAGES}/${imageUrl}` || '/default-image.png'
          }
          alt="Empty State"
          width={180}
          height={180}
        />
      )}
      {headerOne && <h1 className="text-md font-semibold ">{headerOne}</h1>}
      {headerTwo && <h1 className="text-md font-semibold">{headerTwo}</h1>}
      <p className="text-muted-foreground font-sans text-sm">{description}</p>
      {buttonText && (
        <CustomButton
          variant={buttonVariant ? (buttonVariant as CustomButtonVariant) : 'default'}
          icon={buttonIcon}
          onClick={onButtonClick}
        >
          {buttonText}
        </CustomButton>
      )}
    </CardCustom>
  );
}

export default EmptyData;
