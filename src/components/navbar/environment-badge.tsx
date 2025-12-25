import { BadgeCustom } from '@/components/badge/BadgeCustom';
import React from 'react';

export function EnvironmentBadge() {
  const env = process.env.NEXT_PUBLIC_APP_ENV?.toUpperCase();

  if (!env || env === 'PRODUCTION' || env === 'STAGING') return null;

  return (
    <BadgeCustom className="z-50 bg-primary hover:bg-primary/80 transition-all duration-300 ease-in-out rounded-full p-2">
      <span className="text-xs font-medium p-1 flex items-center justify-center">
        Environment:&nbsp;
        <span className="font-bold">{env}</span>
      </span>
    </BadgeCustom>
  );
}
