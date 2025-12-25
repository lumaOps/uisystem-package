'use client';

import React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/utils/utils';

export interface AvatarCustomProps {
  image?: string;
  fallback?: React.ReactNode;
  alt?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

export const AvatarCustom: React.FC<AvatarCustomProps> = ({
  image,
  fallback,
  alt,
  className,
  imageClassName,
  fallbackClassName,
}) => {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    >
      {/* Always render the image element */}
      {image && (
        <AvatarPrimitive.Image
          src={image}
          alt={alt}
          className={cn('aspect-square h-full w-full object-cover', imageClassName)}
        />
      )}

      {/* Fallback is shown automatically if image fails */}
      <AvatarPrimitive.Fallback
        delayMs={100}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-muted',
          fallbackClassName
        )}
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

AvatarCustom.displayName = 'AvatarCustom';
