'use client';

import * as React from 'react';
import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QRCodeCustomProps } from '@/types/common/qr-code/qrCodeCustom';

export function QRCodeCustom({
  value = 'sun.autodealersdigital.com',
  size = 100,
  level = 'M',
  className = '',
}: QRCodeCustomProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!value) return null;

  return (
    <div
      ref={qrRef}
      className={`flex justify-center items-center w-full aspect-square max-w-[${size}px] sm:max-w-[90px] md:max-w-[100px] ${className}`}
    >
      <QRCodeSVG value={value} level={level} className="w-full h-auto" />
    </div>
  );
}
