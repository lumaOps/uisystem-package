import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CarouselImageProps } from '@/types/global-types';
import { DEFAULT_IMAGE } from '@/constants/defaultImage';

export function CarouselImage({
  src,
  alt,
  width = 540,
  height = 219,
  objectFit = 'cover',
}: CarouselImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);
  return (
    <Image
      width={width}
      height={height}
      src={imgSrc}
      alt={alt}
      draggable={false}
      onError={() => setImgSrc(`${process.env.NEXT_PUBLIC_DEFAULT_IMAGE}${DEFAULT_IMAGE}`)}
      className={`w-full h-full ${objectFit}`}
    />
  );
}
