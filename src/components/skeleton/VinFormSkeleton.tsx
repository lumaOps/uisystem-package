import React from 'react';
import { SkeletonCustom } from './SkeletonCustom';
import { CardCustom } from '@/components/card/CardCustom';

export function VinFormSkeleton() {
  return (
    <div className="grid gap-6 w-full">
      <CardCustom
        contentClassName="space-y-4"
        containerClassName="border-none shadow-none bg-transparant"
      >
        <div className="grid gap-2">
          <SkeletonCustom count={1} width="w-1/3" height="h-6" shape="circle" />
        </div>
        <div className="grid gap-2">
          <SkeletonCustom count={1} width="w-2/3" height="h-5" shape="circle" />
        </div>
        <div className="flex flex-1/2 gap-2">
          <SkeletonCustom count={2} width="w-1/2" height="h-10" shape="circle" />
        </div>
      </CardCustom>
    </div>
  );
}
