import React from 'react';
import { CustomButton } from '@/components/button/CustomButton';
import Image from 'next/image';
import { cn } from '@/utils/utils';
import { CardCustom } from '@/components/card/CardCustom';
import { StatusCardProps } from '@/types/global-types';

const StatusCard: React.FC<StatusCardProps> = ({
  srcImage,
  message,
  messageClassName,
  description,
  buttonText,
  onActivate,
  isLoading = false,
  secondaryButtonText,
  onSecondaryActivate,
  secondaryIsLoading = false,
  showBorder = true,
  imageWidth = 120,
  imageHeight = 120,
  loadingText = 'Activating...',
  secondaryLoadingText = 'Loading...',
  contentClassName = '',
  className = '',
  icon,
  positionIcon,
  loadingClassName,
}) => {
  // Disable both buttons when either is loading
  const anyButtonLoading = isLoading || secondaryIsLoading;

  return (
    <CardCustom
      containerClassName={cn(showBorder ? 'p-3' : 'border-none shadow-none p-3', className)}
      contentClassName={cn('py-0', contentClassName)}
    >
      <div className="flex justify-center mb-3">
        <Image
          width={imageWidth}
          height={imageHeight}
          src={`${process.env.NEXT_PUBLIC_CDN_IMAGES}/${srcImage}` || '/default-image.png'}
          alt=""
        />
      </div>

      <p className={cn('text-muted-foreground text-center mb-4 text-md', messageClassName)}>
        {message}
      </p>

      <p className="text-muted-foreground leading-relaxed text-center mb-2 text-sm">
        {description}
      </p>

      <div className="flex flex-col gap-4 items-center mb-4 w-full max-w-md mx-auto">
        {secondaryButtonText && onSecondaryActivate && (
          <CustomButton
            variant="outline"
            onClick={onSecondaryActivate}
            disabled={anyButtonLoading}
            isLoading={secondaryIsLoading}
          >
            {secondaryIsLoading ? secondaryLoadingText : secondaryButtonText}
          </CustomButton>
        )}
        {buttonText && (
          <CustomButton
            onClick={onActivate}
            disabled={isLoading}
            isLoading={isLoading}
            icon={icon}
            positionIcon={positionIcon}
            loaderClassName={loadingClassName}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <span>{loadingText}</span>
              </div>
            ) : (
              buttonText
            )}
          </CustomButton>
        )}
      </div>
    </CardCustom>
  );
};

export default StatusCard;
