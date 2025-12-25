'use client';

import React from 'react';
import { Skeleton } from './skeleton';

export default function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-64" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
