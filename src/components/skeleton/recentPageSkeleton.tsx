'use client';

import { SkeletonCustom } from './SkeletonCustom';

export function RecentPageSkeleton() {
  return (
    <div className="flex items-center justify-between py-2 w-full">
      <div className="flex items-center gap-2">
        <SkeletonCustom width="w-4" height="h-4" shape="circle" />
        <SkeletonCustom width="w-24" height="h-4" shape="rounded" />
      </div>
      <SkeletonCustom width="w-4" height="h-4" shape="circle" />
    </div>
  );
}
